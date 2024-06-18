import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { FaClock, FaHeart, FaTag } from 'react-icons/fa';

import DevBadge from '@/components/badges/dev-badge';
import ClientCard from '@/components/cards/client-card';
import { WorkCard } from '@/components/cards/work-card';
import AutoScroll from '@/components/content/auto-scroll';
import Section from '@/components/content/section';
import SectionTitle from '@/components/content/section/title';
import Footer from '@/components/layout/footer';
import CLIENTS from '@/config/clients';
import CURRENTLY from '@/config/currently';
import SKILLS from '@/config/skills';
import useGTM from '@/hooks/useGTM';
import useScreen from '@/hooks/useScreen';

export default function Home() {
  const screen = useScreen();
  const isSmall = screen == 'tablet' || screen == 'mobile';

  const time = useGTM(-3);

  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      flexDir={'column'}
      gap={'20px'}
      width={'100%'}
      mt={'25px'}
    >
      {/* Avatar */}
      <Image
        alt="Sammwy's GitHub avatar"
        src={'https://avatars.githubusercontent.com/u/44925968?v=4'}
        borderRadius={'50%'}
        width={'10vw'}
      />

      {/* Greetings */}
      <Heading size={isSmall ? '2xl' : '4xl'}>Howdy! I&apos;m /Sammwy/</Heading>
      <Heading size={isSmall ? 'xl' : '2xl'} color={'inherit'}>
        A Software Engineer
      </Heading>

      {/* Brief */}
      <Flex
        mt={'50px'}
        w={'95%'}
        maxWidth={'720px'}
        justifyContent={'space-between'}
        fontFamily={'rainyhearts'}
        userSelect={'none'}
        gap={'10px'}
      >
        {/* Time */}
        <Section p={'10px 20px'} alignItems={'center'} gap={'7px'}>
          <FaClock size={'15px'} /> {time}
        </Section>

        {/* Pronouns */}
        <Section p={'10px 20px'} alignItems={'center'} gap={'7px'}>
          <FaTag size={'15px'} /> She/Her
        </Section>

        {/* Personality */}
        <Section p={'10px 20px'} alignItems={'center'} gap={'7px'}>
          <FaHeart size={'15px'} /> INTJ
        </Section>
      </Flex>

      {/* About me */}
      <Section p={'10px 20px'} flexDir={'column'} maxWidth={'95%'}>
        <SectionTitle icon="/assets/icons/cinnamon.png">About me</SectionTitle>

        <Text
          maxWidth={'700px'}
          letterSpacing={'1px'}
          fontWeight={'hairline'}
          opacity={'.8'}
        >
          I&lsquo;m a self-taught fullstack programmer with a soft spot for Rust
          and TypeScript. Love mangas, anime and other weirdo stuff. Also I like
          to listen to breakcore while working. I dive into the playful world of
          hardware hacking, cybersecurity, and MMORPGs while cuddling up to
          open-source projects. With high experience in Twitch API and Minecraft
          modding, let&lsquo;s make some magic happen! 🌟
        </Text>
      </Section>

      {/* Clients */}
      <Flex flexDir={'column'} alignItems={'center'} gap={'20px'} mt={'70px'}>
        <Heading color={'inherit'} size={'lg'}>
          My clients
        </Heading>

        <AutoScroll>
          {CLIENTS.map((c, i) => (
            <ClientCard key={i} {...c} />
          ))}
        </AutoScroll>
      </Flex>

      {/* Skills */}
      <Flex flexDir={'column'} alignItems={'center'} gap={'20px'} mt={'70px'}>
        <Heading color={'inherit'} size={'lg'}>
          Skills
        </Heading>

        {SKILLS.map((group, i) => (
          <Section
            key={i}
            p={'10px 20px'}
            flexDir={'column'}
            maxWidth={'700px'}
            width={'95%'}
          >
            <Heading color={'inherit'} size={'lg'}>
              {group.title}
            </Heading>

            <Box width={'100%'} mt={'10px'}>
              {group.skills.map((skill, j) => (
                <DevBadge key={j}>{skill}</DevBadge>
              ))}
            </Box>
          </Section>
        ))}
      </Flex>

      {/* Currently working on */}
      <Flex
        flexDir={'column'}
        alignItems={'center'}
        gap={'20px'}
        my={'70px'}
        maxW={'95%'}
      >
        <Heading color={'inherit'} size={'lg'}>
          Currently working on
        </Heading>

        {CURRENTLY.map(({ description, ...work }, i) => (
          <WorkCard key={i} {...work}>
            {description}
          </WorkCard>
        ))}
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
