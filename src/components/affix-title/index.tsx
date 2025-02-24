import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

export interface AffixTitleProps {
  /** Triggered when distance from window top reaches specified offset, default 320 */
  offsetTop?: number;
  title: string;
}

const AffixTitle = (props: AffixTitleProps) => {
  const { title, offsetTop = 320 } = props;
  const affixTitleRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const classes = classNames(
    'fixed left-0 right-0 top-0 w-full transform bg-background/80 backdrop-blur-md transition-all duration-300 ease-in-out z-10',
    isVisible ? ['translate-y-0', 'opacity-100'] : ['-translate-y-full', 'opacity-0'],
  );

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    setIsVisible(scrollTop >= offsetTop);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={affixTitleRef}
      className={classes}
    >
      <div className="mx-auto flex items-center justify-between px-8 max-w-5xl">
        <button
          onClick={() => window.location.href = '/'}
          className="text-xl text-slate11 hover:text-slate12 transition-colors cursor-pointer w-8"
        >
          ←
        </button>
        <div className="py-4 font-bold text-slate12">{title}</div>
        <div className="w-4" />
      </div>
    </div>
  );
};

export default AffixTitle;
