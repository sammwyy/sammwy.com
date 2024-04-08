import { Flex } from '@chakra-ui/react';
import { ReactNode } from 'react';

import styles from './AutoScroll.module.css';

export interface AutoScrollProps {
  children: ReactNode[];
}

export function AutoScroll({ children }: AutoScrollProps) {
  return (
    <Flex className={styles.scroll}>
      <Flex className={styles.primary}>{children}</Flex>
      <Flex className={styles.secondary}>{children}</Flex>
    </Flex>
  );
}
