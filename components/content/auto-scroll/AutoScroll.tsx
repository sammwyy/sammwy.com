import { Flex } from '@chakra-ui/react';
import { ReactNode, useRef } from 'react';

import styles from './AutoScroll.module.css';

export interface AutoScrollProps {
  children: ReactNode[];
}

export function AutoScroll({ children }: AutoScrollProps) {
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (primaryRef.current && secondaryRef.current) {
      primaryRef.current.style.animationPlayState = 'paused';
      secondaryRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    if (primaryRef.current && secondaryRef.current) {
      primaryRef.current.style.animationPlayState = 'running';
      secondaryRef.current.style.animationPlayState = 'running';
    }
  };

  return (
    <Flex
      className={styles.scroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex className={styles.primary} ref={primaryRef}>
        {children}
      </Flex>
      <Flex className={styles.secondary} ref={secondaryRef}>
        {children}
      </Flex>
    </Flex>
  );
}
