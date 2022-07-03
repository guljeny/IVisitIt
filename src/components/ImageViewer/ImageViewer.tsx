import { memo, useEffect, useRef, PropsWithChildren } from 'react';
import cn from 'classnames';
import ImageObserver from './ImageObserver';

import styles from './styles.css';

interface IProps {
  modifiers?: string;
  maxScale?: number;
  minScale?: number;
}

// const imageObserver = new ImageObserver();

export default memo(({ modifiers, children, maxScale, minScale }: PropsWithChildren<IProps>) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    new ImageObserver(containerRef.current, { maxScale, minScale });
    // if (containerRef.current) imageObserver.setContainer(containerRef.current);

    // return imageObserver.removeListeners;
  }, []);

  return (
    <div
      className={cn(
        styles.container,
        modifiers,
      )}
      ref={containerRef}
    >
      {children}
    </div>
  );
});
