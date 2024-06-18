import {
  Box,
  Flex,
  Heading,
  IconButton,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropsWithChildren, useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaDiscord,
  FaGithub,
  FaMoon,
  FaSun,
  FaTwitch,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';

import Section from '@/components/content/section';
import useScreen from '@/hooks/useScreen';

import styles from './navbar.module.css';

// ToggleMode Component
function ToggleModeButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  const icon = colorMode === 'light' ? <FaMoon /> : <FaSun />;

  return (
    <Box borderLeft={'1px solid #7777'}>
      <IconButton
        aria-label="Toggle light/dark mode"
        icon={icon}
        onClick={toggleColorMode}
        variant={'ghost'}
        ml={'20px'}
      />
    </Box>
  );
}

// NavLink component.
interface NavLinkProps extends PropsWithChildren {
  href: string;
}

function NavLink({ children, href }: NavLinkProps) {
  const { pathname } = useRouter();
  const active = pathname === href;

  return (
    <Link href={href}>
      <Text className={styles.link} color={active ? 'purple.300' : 'inherit'}>
        /{children}/
      </Text>
    </Link>
  );
}

// SocialLink component.
interface SocialLinkProps {
  color: string;
  href: string;
  icon: IconType;
}

function SocialLink({ icon: Icon, href, color }: SocialLinkProps) {
  return (
    <Link href={href} rel={'noopener noreferrer'} target={'_blank'}>
      <IconButton
        aria-label="Social Link"
        icon={<Icon color={color} />}
        variant={'ghost'}
      />
    </Link>
  );
}

export default function Navbar() {
  const screen = useScreen();
  const isSmall = screen == 'tablet' || screen == 'mobile';
  const isMid = screen == 'laptop';

  const { colorMode } = useColorMode();
  const bg = colorMode === 'light' ? '#dddb' : '#333b';

  const INITIAL_TOP = isSmall || isMid ? '45px' : '35px';
  const [marginTop, setMarginTop] = useState(INITIAL_TOP);

  useEffect(() => {
    // Detect page scroll and apply class.
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setMarginTop('15px');
      } else {
        setMarginTop(INITIAL_TOP);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [INITIAL_TOP]);

  return (
    <Flex className={styles.navbar} mt={marginTop}>
      <Section
        className={styles.content}
        justifyContent={isSmall ? 'center' : 'space-between'}
        bg={bg}
      >
        <Flex className={styles.section}>
          {!isSmall && (
            <Flex className={styles.brand}>
              <Heading size={'xl'} className={styles.title}>
                ପ(๑•ᴗ•๑)ଓ ♡
              </Heading>
            </Flex>
          )}
          <NavLink href="/">home</NavLink>
          <NavLink href="/blog">blog</NavLink>
          <NavLink href="/projects">projects</NavLink>
        </Flex>

        {!isSmall && (
          <Flex className={styles.section}>
            <SocialLink
              href={'https://twitter.com/sammwy'}
              icon={FaTwitter}
              color={'#1DA1F2'}
            />
            <SocialLink
              href={'https://github.com/sammwyy'}
              icon={FaGithub}
              color={'#777'}
            />
            <SocialLink
              href={'https://discord.gg/'}
              icon={FaDiscord}
              color={'#5865F2'}
            />
            <SocialLink
              href={'https://youtube.com/@sammwy'}
              icon={FaYoutube}
              color={'#FF0000'}
            />
            <SocialLink
              href={'https://twitch.tv/sammwy'}
              icon={FaTwitch}
              color={'#6441A4'}
            />

            <ToggleModeButton />
          </Flex>
        )}
      </Section>
    </Flex>
  );
}
