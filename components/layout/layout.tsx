import { Flex, useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { PropsWithChildren } from 'react';

import styles from './layout.module.css';
import Navbar from './navbar';
const Player = dynamic(() => import('./player'), { ssr: false });

export default function Layout({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  const bgImage =
    colorMode === 'light' ? '/assets/bg-light.jpg' : '/assets/bg-dark.jpg';

  const { pathname } = useRouter();
  const isHome = pathname === '/';

  return (
    <Flex
      flexDir={'column'}
      width={'100vw'}
      bgImage={`url(${bgImage})`}
      className={styles.layout}
    >
      <Player />
      <Navbar />

      <Flex pt={'100px'} mb={isHome ? '0px' : '25px'} width={'100%'}>
        {children}
      </Flex>
    </Flex>
  );
}
