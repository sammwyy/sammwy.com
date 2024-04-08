import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';

import DevBadge from '@/components/badges/dev-badge';
import ClientCard from '@/components/cards/client-card';
import AutoScroll from '@/components/content/auto-scroll';
import Section from '@/components/content/section';
import useScreen from '@/hooks/useScreen';

export default function Home() {
  const screen = useScreen();
  const isSmall = screen == 'tablet' || screen == 'mobile';

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

      {/* About me */}
      <Section mt={'50px'} p={'10px 20px'} flexDir={'column'} maxWidth={'95%'}>
        <Heading color={'inherit'} size={'lg'}>
          ✨ About me
        </Heading>

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
          <ClientCard
            username={'Rubius'}
            category={'Streamer'}
            comment={'Twitch integrations and minecraft modding.'}
            avatar={'/clients/rubius.jpg'}
            link={'https://twitch.tv/rubius'}
          />

          <ClientCard
            username={'Robleis'}
            category={'Streamer'}
            comment={'Twitch integrations and minecraft modding.'}
            avatar={'/clients/robleis.png'}
            link={'https://www.twitch.tv/robleis'}
          />

          <ClientCard
            username={'Carreraaa'}
            category={'Streamer'}
            comment={'Twitch integrations.'}
            avatar={'/clients/carreraaa.png'}
            link={'https://www.twitch.tv/carreraaa'}
          />
          <ClientCard
            username={'xCry'}
            category={'Streamer'}
            comment={'Twitch integrations and minecraft modding.'}
            avatar={'/clients/xcry.png'}
            link={'https://www.twitch.tv/xcry'}
          />

          <ClientCard
            username={'Staryuuki'}
            category={'Streamer'}
            comment={'Twitch integrations.'}
            avatar={'/clients/staryuuki.png'}
            link={'https://www.twitch.tv/staryuuki'}
          />

          <ClientCard
            username={'Spreen'}
            category={'Streamer'}
            comment={'Twitch integrations.'}
            avatar={'/clients/spreen.png'}
            link={'https://www.twitch.tv/elspreen'}
          />

          <ClientCard
            username={'Farfadox'}
            category={'YouTuber/Streamer'}
            comment={'Software development.'}
            avatar={'/clients/farfadox.png'}
            link={'https://www.twitch.tv/farfadoxvevo'}
          />

          <ClientCard
            username="Lexosi"
            category="Streamer"
            comment="Minecraft modding."
            avatar="/clients/lexosi.jpeg"
            link="https://www.twitch.tv/lexosi"
          />

          <ClientCard
            username="Soarinng"
            category="Streamer"
            comment="Minecraft modding."
            avatar="/clients/soarinng.png"
            link="https://www.twitch.tv/soarinng"
          />

          <ClientCard
            username="Alexby11"
            category="Streamer"
            comment="Game server Management."
            avatar="/clients/alexby11.jpg"
            link="https://www.twitch.tv/alexby11"
          />

          <ClientCard
            username="Pipepino"
            category="YouTuber"
            comment="Website development."
            avatar="/clients/pipepino.jpg"
            link="https://www.youtube.com/c/Pipepino"
          />

          <ClientCard
            username="Jota"
            category="YouTuber"
            comment="Website development."
            avatar="/clients/jota.jpg"
            link="https://www.youtube.com/@Jota."
          />

          <ClientCard
            username="FapParaMoar"
            category="Streamer"
            comment="Twitch integrations."
            avatar="/clients/fapparamoar.webp"
            link="https://www.twitch.tv/fapparamoar"
          />
        </AutoScroll>
      </Flex>

      {/* Skills */}
      <Flex flexDir={'column'} alignItems={'center'} gap={'20px'} mt={'70px'}>
        <Heading color={'inherit'} size={'lg'}>
          Skills
        </Heading>

        <Section
          p={'10px 20px'}
          flexDir={'column'}
          maxWidth={'700px'}
          width={'95%'}
        >
          <Heading color={'inherit'} size={'lg'}>
            ☕ Languages
          </Heading>

          <Box width={'100%'} mt={'10px'}>
            <DevBadge>Bash</DevBadge>
            <DevBadge>C#</DevBadge>
            <DevBadge>CSS</DevBadge>
            <DevBadge>HTML</DevBadge>
            <DevBadge>Java</DevBadge>
            <DevBadge>JavaScript</DevBadge>
            <DevBadge>Markdown</DevBadge>
            <DevBadge>Python</DevBadge>
            <DevBadge>Rust</DevBadge>
            <DevBadge>Sass</DevBadge>
            <DevBadge>SQL</DevBadge>
            <DevBadge>TypeScript</DevBadge>
          </Box>
        </Section>

        <Section
          p={'10px 20px'}
          flexDir={'column'}
          maxWidth={'700px'}
          width={'95%'}
        >
          <Heading color={'inherit'} size={'lg'}>
            📚 Frameworks and Libraries
          </Heading>

          <Box width={'100%'} mt={'10px'}>
            <DevBadge>Apollo</DevBadge>
            <DevBadge>Bootstrap</DevBadge>
            <DevBadge>.NET</DevBadge>
            <DevBadge>Electron</DevBadge>
            <DevBadge>Express</DevBadge>
            <DevBadge>GitHub Actions</DevBadge>
            <DevBadge>GraphQL</DevBadge>
            <DevBadge>Junit</DevBadge>
            <DevBadge>NestJS</DevBadge>
            <DevBadge>NextJS</DevBadge>
            <DevBadge>React</DevBadge>
            <DevBadge>Tauri</DevBadge>
            <DevBadge>Unity</DevBadge>
          </Box>
        </Section>

        <Section
          p={'10px 20px'}
          flexDir={'column'}
          maxWidth={'700px'}
          width={'95%'}
        >
          <Heading color={'inherit'} size={'lg'}>
            🔨 Tools
          </Heading>

          <Box width={'100%'} mt={'10px'}>
            <DevBadge>Apache</DevBadge>
            <DevBadge>Apache Maven</DevBadge>
            <DevBadge>Debian</DevBadge>
            <DevBadge>Git</DevBadge>
            <DevBadge>Insomnia</DevBadge>
            <DevBadge>Nginx</DevBadge>
            <DevBadge>Notion</DevBadge>
            <DevBadge>OBS</DevBadge>
            <DevBadge>Trello</DevBadge>
            <DevBadge>Ubuntu</DevBadge>
            <DevBadge>Visual Studio Code</DevBadge>
          </Box>
        </Section>

        <Section
          p={'10px 20px'}
          flexDir={'column'}
          maxWidth={'700px'}
          width={'95%'}
        >
          <Heading color={'inherit'} size={'lg'}>
            ☁ Cloud and Providers
          </Heading>

          <Box width={'100%'} mt={'10px'}>
            <DevBadge>AWS</DevBadge>
            <DevBadge>Cloudflare</DevBadge>
            <DevBadge>GitHub Pages</DevBadge>
            <DevBadge>MariaDB</DevBadge>
            <DevBadge>MongoDB</DevBadge>
            <DevBadge>MySQL</DevBadge>
            <DevBadge>Nginx</DevBadge>
            <DevBadge>Redis</DevBadge>
            <DevBadge>Vercel</DevBadge>
          </Box>
        </Section>
      </Flex>
    </Flex>
  );
}
