import { useMemo, useState, useEffect, type ReactNode } from 'react';
import DesktopOutlined from '@/assets/images/desktop-outlined.svg?react';
import SunOutlined from '@/assets/images/sun-outlined.svg?react';
import MoonOutlined from '@/assets/images/moon-outlined.svg?react';
import stateConfig from '~@/slate.config';
import { setThemeMode } from '@/helpers/utils';
import type { ThemeOptions } from '@/typings/config';
import { ThemeValue } from '@/typings/global';

const THEME_LIST: Array<{ icon: ReactNode; value: ThemeValue }> = [
  {
    icon: <DesktopOutlined className="size-5" />,
    value: ThemeValue.Auto,
  },
  {
    icon: <SunOutlined className="size-5" />,
    value: ThemeValue.Light,
  },
  {
    icon: <MoonOutlined className="size-5" />,
    value: ThemeValue.Dark,
  },
];

const ThemeSelect = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeValue>();

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (
      theme === ThemeValue.Light ||
      theme === ThemeValue.Dark ||
      theme === ThemeValue.Auto
    ) {
      setCurrentTheme(theme);
      return;
    }
    const presetTheme = (stateConfig.theme as ThemeOptions).mode;
    setCurrentTheme(presetTheme as ThemeValue);
  }, []);

  const themeSelectClasses = useMemo(() => {
    if (currentTheme === ThemeValue.Dark) {
      return 'right-1';
    } else if (currentTheme === ThemeValue.Light) {
      return 'left-1/2 -translate-x-1/2';
    } else {
      return 'left-1';
    }
  }, [currentTheme]);

  const handleThemeChange = (value: ThemeValue) => {
    setCurrentTheme(value);

    let mode = value;
    if (value === ThemeValue.Auto) {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? ThemeValue.Dark
        : ThemeValue.Light;
    }
    localStorage.setItem('theme', value);
    setThemeMode(mode);
  };

  return (
    <div
      className="bg-slate3 text-slate8 relative flex items-center rounded-full px-3 h-18 gap-4"
      role="radiogroup"
    >
      <div
        className={`bg-slate1 transition-all duration-400 absolute top-1 size-16 rounded-full ${themeSelectClasses}`}
      ></div>
      {THEME_LIST.map((item) => (
        <div
          className={`relative inline-flex size-12 cursor-pointer items-center justify-center transition-colors ${item.value === currentTheme ? 'text-slate12' : 'text-slate10 hover:text-slate11'}`}
          key={item.value}
          onClick={() => handleThemeChange(item.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleThemeChange(item.value);
            }
          }}
          tabIndex={0}
          role="radio"
          aria-label={item.value}
          aria-checked={item.value === currentTheme}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default ThemeSelect;
