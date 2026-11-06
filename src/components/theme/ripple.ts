// Liquid "drip ripple" theme transition.
//
// The new theme is revealed through a View Transition: `::view-transition-new(root)`
// is clipped by a wobbly, dripping blob that grows from the clicked icon. On top of it,
// a WebGL canvas (its own live view-transition group) shades the wavefront with a
// meniscus highlight, a soft drop shadow and trailing water ripples.
// The blob outline is computed by the same function in JS (clip-path) and GLSL (shader).

const DURATION = 1300;
const KEYFRAMES = 48;
const POLY_POINTS = 140;

const ease = (p: number) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

// Keep in sync with `edge()` in the fragment shader.
function edge(theta: number, t: number, r: number, p: number) {
  const wobble =
    0.06 * Math.sin(3 * theta + 4 * t) + 0.04 * Math.sin(7 * theta - 6 * t) + 0.025 * Math.sin(13 * theta + 9 * t);
  const down = Math.max(0, Math.sin(theta));
  const drip = 0.16 * p * down * down * down * Math.pow(0.5 + 0.5 * Math.cos(11 * theta + 0.7), 6);
  return r * (1 + wobble + drip);
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform vec2 uOrigin;
uniform float uR;
uniform float uT;
uniform float uP;

float edge(float theta) {
  float wobble = 0.06 * sin(3.0 * theta + 4.0 * uT)
               + 0.04 * sin(7.0 * theta - 6.0 * uT)
               + 0.025 * sin(13.0 * theta + 9.0 * uT);
  float down = max(0.0, sin(theta));
  float drip = 0.16 * uP * down * down * down * pow(0.5 + 0.5 * cos(11.0 * theta + 0.7), 6.0);
  return uR * (1.0 + wobble + drip);
}

void main() {
  // CSS pixels, origin top-left, y down (matches clip-path coordinates).
  vec2 frag = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 v = frag - uOrigin;
  float d = length(v);
  float sd = d - edge(atan(v.y, v.x)); // < 0 inside the revealed area

  float inside = 1.0 - step(0.0, sd);
  float meniscus = exp(-pow((sd + 7.0) / 6.0, 2.0)) * inside;
  float shadow = exp(-pow((sd - 6.0) / 10.0, 2.0)) * (1.0 - inside);

  float k = -sd;
  float wave = sin(k * 0.085 - uT * 14.0) * exp(-k / 160.0) * inside;

  float fade = 1.0 - smoothstep(0.8, 1.0, uP);
  float light = (meniscus * 0.5 + max(wave, 0.0) * 0.16) * fade;
  float dark = (shadow * 0.28 + max(-wave, 0.0) * 0.1) * fade;

  // Premultiplied: white highlight composited over black shadow.
  gl_FragColor = vec4(vec3(light), 1.0 - (1.0 - light) * (1.0 - dark));
}
`;

function createOverlay() {
  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: `${w}px`,
    height: `${h}px`,
    pointerEvents: 'none',
    zIndex: '2147483647',
    viewTransitionName: 'theme-ripple',
  });

  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.viewport(0, 0, canvas.width, canvas.height);

  const u = (name: string) => gl.getUniformLocation(program, name);
  gl.uniform2f(u('uRes'), w, h);
  gl.uniform1f(u('uDpr'), dpr);
  const uOrigin = u('uOrigin');
  const uR = u('uR');
  const uT = u('uT');
  const uP = u('uP');

  const draw = (x: number, y: number, r: number, t: number, p: number) => {
    gl.uniform2f(uOrigin, x, y);
    gl.uniform1f(uR, r);
    gl.uniform1f(uT, t);
    gl.uniform1f(uP, p);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const dispose = () => {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    canvas.remove();
  };

  return { canvas, draw, dispose };
}

export function rippleThemeChange(origin: { x: number; y: number }, apply: () => void) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!document.startViewTransition || reduceMotion) {
    apply();
    return;
  }

  const { x, y } = origin;
  const w = window.innerWidth;
  const h = window.innerHeight;
  // Wobble can pull the edge in by ~12.5%, so overshoot the farthest corner.
  const maxR = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 1.2;
  const radiusAt = (p: number) => ease(p) * maxR;

  let overlay: ReturnType<typeof createOverlay> = null;

  const transition = document.startViewTransition(() => {
    apply();
    overlay = createOverlay();
    if (overlay) {
      overlay.draw(x, y, 0, 0, 0);
      document.body.appendChild(overlay.canvas);
    }
  });

  transition.ready
    .then(() => {
      const keyframes: Keyframe[] = [];
      for (let k = 0; k <= KEYFRAMES; k++) {
        const p = k / KEYFRAMES;
        const t = (p * DURATION) / 1000;
        const r = radiusAt(p);
        const points: string[] = [];
        for (let i = 0; i < POLY_POINTS; i++) {
          const theta = (i / POLY_POINTS) * Math.PI * 2;
          const e = edge(theta, t, r, p);
          points.push(`${(x + Math.cos(theta) * e).toFixed(1)}px ${(y + Math.sin(theta) * e).toFixed(1)}px`);
        }
        keyframes.push({ clipPath: `polygon(${points.join(',')})` });
      }

      document.documentElement.animate(keyframes, {
        duration: DURATION,
        easing: 'linear',
        fill: 'both',
        pseudoElement: '::view-transition-new(root)',
      });

      if (!overlay) return;
      const start = performance.now();
      const frame = (now: number) => {
        const p = Math.min((now - start) / DURATION, 1);
        overlay?.draw(x, y, radiusAt(p), (p * DURATION) / 1000, p);
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    })
    .catch(() => {});

  transition.finished.finally(() => overlay?.dispose());
}
