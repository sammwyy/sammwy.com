import { Flex } from '@chakra-ui/react';

import styles from './sidebar.module.css';

export default function Sidebar() {
  return (
    <Flex className={styles.sidebar} bg={'green.800'}>
      Sidebar
    </Flex>
  );
}
