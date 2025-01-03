import { Flex, Text, useColorMode } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { PropsWithChildren } from 'react';

import useScreen from '@/hooks/useScreen';

import Footer from './footer';
import styles from './layout.module.css';
import Navbar from './navbar';
const Player = dynamic(() => import('./player'), { ssr: false });

export default function Layout({ children }: PropsWithChildren) {
  const { colorMode } = useColorMode();
  const bgImage =
    colorMode === 'light' ? '/assets/bg-light.jpg' : '/assets/bg-dark.jpg';

  const screen = useScreen();
  const isSmall = screen == 'tablet' || screen == 'mobile';

  return (
    <Flex
      flexDir={'column'}
      width={'100vw'}
      bgImage={`url(${bgImage})`}
      className={styles.layout}
    >
      <Player />
      <Navbar />

      <Flex pt={'100px'} pb={'50px'} width={'100%'}>
        {children}
      </Flex>

      <Footer>
        <Flex
          flexDir={isSmall ? 'column' : 'row'}
          alignItems={'center'}
          justifyContent={'space-around'}
          fontSize={'13px'}
          w={'100%'}
          color={'gray'}
        >
          <Flex gap={'5px'}>
            BTC{' '}
            <Text color={'purple.500'}>
              bc1q4uzvtx6nsgt7pt7678p9rqel4hkhskpxvck8uq
            </Text>
          </Flex>
          <Flex gap={'5px'}>
            ETH/BSC{' '}
            <Text color={'purple.500'}>
              0x7a70a0C1889A9956460c3c9DCa8169F25Bb098af
            </Text>
          </Flex>

          <Flex gap={'5px'}>
            SOL{' '}
            <Text color={'purple.500'}>
              7UcE4PzrHoGqFKHyVgsme6CdRSECCZAoWipsHntu5rZx
            </Text>
          </Flex>
        </Flex>
      </Footer>
    </Flex>
  );
}
