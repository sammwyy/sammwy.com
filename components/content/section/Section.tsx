import { Flex, FlexProps, useColorMode } from '@chakra-ui/react';

import styles from './section.module.css';

export interface SectionProps extends FlexProps {
  orbit?: number | boolean;
}

export function Section({ children, orbit, ...props }: SectionProps) {
  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? '#eeeb' : '#333b';

  return (
    <Flex
      bg={bg}
      className={styles.section}
      style={{ overflow: orbit ? 'hidden' : 'inherit' }}
      {...props}
    >
      {orbit && (
        <div
          className={styles.trail}
          style={{ width: `${orbit === true ? 5 : orbit}px` }}
        ></div>
      )}
      {children}
    </Flex>
  );
}
