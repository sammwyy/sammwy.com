import { Text, useColorMode } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import * as FA from 'react-icons/fa';
import * as SI from 'react-icons/si';

import Section from '@/components/content/section';

import styles from './DevBadge.module.css';

export type DevBadgeIcon =
  | 'bash'
  | 'c#'
  | 'css'
  | 'html'
  | 'java'
  | 'javascript'
  | 'markdown'
  | 'node.js'
  | 'python'
  | 'rust'
  | 'sass'
  | 'solidity'
  | 'sql'
  | 'typescript'
  | 'apollo'
  | 'bootstrap'
  | '.net'
  | 'electron'
  | 'express'
  | 'github-actions'
  | 'graphql'
  | 'junit'
  | 'nestjs'
  | 'nextjs'
  | 'react'
  | 'tauri'
  | 'unity'
  | 'apache'
  | 'apache-maven'
  | 'debian'
  | 'git'
  | 'insomnia'
  | 'nginx'
  | 'notion'
  | 'obs'
  | 'trello'
  | 'ubuntu'
  | 'visual-studio-code'
  | 'aws'
  | 'cloudflare'
  | 'github-pages'
  | 'mariadb'
  | 'mongodb'
  | 'mysql'
  | 'nginx'
  | 'redis'
  | 'vercel'
  | 'vite'
  | 'tailwindcss'
  | 'chakraui'
  | 'arduino'
  | 'raspberrypi'
  | 'bluetooth'
  | 'jenkins'
  | 'github'
  | 'atlas'
  | 'railway'
  | 'gradle'
  | 'hono'
  | 'cloudflare-workers'
  | 'ovh'
  | 'jwt'
  | 'passport'
  | 'socket.io'
  | 'docker'
  | 'bun'
  // Types
  | 'hacking';

const icons: { [key in DevBadgeIcon]: IconType } = {
  '.net': SI.SiDotnet,
  'apache-maven': SI.SiApachemaven,
  'c#': SI.SiCsharp,
  'github-actions': SI.SiGithubactions,
  'github-pages': SI.SiGithubpages,
  'node.js': SI.SiNodedotjs,
  'visual-studio-code': SI.SiVisualstudiocode,
  apache: SI.SiApache,
  apollo: SI.SiApollographql,
  bash: SI.SiTermius,
  aws: SI.SiAmazonaws,
  bootstrap: SI.SiBootstrap,
  cloudflare: SI.SiCloudflare,
  css: SI.SiCss3,
  debian: SI.SiDebian,
  electron: SI.SiElectron,
  express: SI.SiExpress,
  graphql: SI.SiGraphql,
  html: SI.SiHtml5,
  java: FA.FaJava,
  javascript: SI.SiJavascript,
  junit: SI.SiJunit5,
  markdown: SI.SiMarkdown,
  nestjs: SI.SiNestjs,
  nextjs: SI.SiNextdotjs,
  nginx: SI.SiNginx,
  python: SI.SiPython,
  react: SI.SiReact,
  rust: SI.SiRust,
  sass: SI.SiSass,
  solidity: SI.SiSolidity,
  sql: SI.SiMysql,
  tauri: SI.SiTauri,
  unity: SI.SiUnity,
  insomnia: SI.SiInsomnia,
  git: SI.SiGit,
  mongodb: SI.SiMongodb,
  mysql: SI.SiMysql,
  mariadb: SI.SiMariadb,
  redis: SI.SiRedis,
  trello: SI.SiTrello,
  ubuntu: SI.SiUbuntu,
  notion: SI.SiNotion,
  obs: SI.SiObsstudio,
  vercel: SI.SiVercel,
  typescript: SI.SiTypescript,
  tailwindcss: SI.SiTailwindcss,
  vite: SI.SiVite,
  chakraui: SI.SiChakraui,
  arduino: SI.SiArduino,
  raspberrypi: SI.SiRaspberrypi,
  bluetooth: SI.SiBluetooth,
  jenkins: SI.SiJenkins,
  github: SI.SiGithub,
  atlas: SI.SiMongodb,
  railway: SI.SiRailway,
  gradle: SI.SiGradle,
  hono: SI.SiHono,
  'cloudflare-workers': SI.SiCloudflareworkers,
  ovh: SI.SiOvh,
  jwt: SI.SiJsonwebtokens,
  passport: SI.SiPassport,
  'socket.io': SI.SiSocketdotio,
  docker: SI.SiDocker,
  bun: SI.SiBun,

  hacking: SI.SiHackthebox,
};

const colors: { [key in DevBadgeIcon]: string } = {
  bash: '#4EAA25',
  'c#': '#178600',
  css: '#2965f1',
  html: '#e34c26',
  java: '#007396',
  javascript: '#f7df1e',
  markdown: '#083fa1',
  'node.js': '#68a063',
  python: '#3572A5',
  rust: '#FFFFFF',
  sass: '#cc6699',
  solidity: '#363636',
  sql: '#f29111',
  typescript: '#007acc',
  apollo: '#311C87',
  bootstrap: '#7952b3',
  '.net': '#512BD4',
  electron: '#47848F',
  express: '#FFFFFF',
  'github-actions': '#FFFFFF',
  graphql: '#E10098',
  junit: '#25a162',
  nestjs: '#E0234E',
  nextjs: '#FFFFFF',
  react: '#61DAFB',
  tauri: '#A67C52',
  unity: '#FFFFFF',
  apache: '#D22128',
  'apache-maven': '#C71A36',
  debian: '#A80030',
  git: '#F05032',
  insomnia: '#5849BE',
  nginx: '#269539',
  notion: '#FFFFFF',
  obs: '#FFFFFF',
  trello: '#0079BF',
  ubuntu: '#E95420',
  'visual-studio-code': '#007ACC',
  aws: '#FF9900',
  cloudflare: '#F38020',
  'github-pages': '#FFFFFF',
  mariadb: '#003545',
  mongodb: '#47A248',
  mysql: '#4479A1',
  redis: '#DC382D',
  vercel: '#FFFFFF',
  vite: '#646CFF',
  tailwindcss: '#38B2AC',
  chakraui: '#319795',
  arduino: '#00979D',
  raspberrypi: '#C51A4A',
  bluetooth: '#0082FC',
  jenkins: '#D24939',
  github: '#FFFFFF',
  atlas: '#47A248',
  railway: '#FFFFFF',
  gradle: '#02303A',
  hono: '#FFC300',
  'cloudflare-workers': '#F38020',
  ovh: '#123F6D',
  jwt: '#e00034',
  passport: '#32DB64',
  'socket.io': '#ffffff',
  docker: '#0db7ed',
  bun: '#FFFFFF',

  hacking: '#FF0000',
};

export interface DevBadgeProps {
  icon?: DevBadgeIcon;
  children?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DevBadge({ icon, size, children }: DevBadgeProps) {
  const { colorMode } = useColorMode();

  const label = children || '';
  const iconID =
    icon || (label.toLowerCase().replace(/ /g, '-') as DevBadgeIcon);
  const Icon = icons[iconID];
  const className = styles['badge-' + (size || 'lg')];
  let color = colors[iconID];

  if (color === '#FFFFFF' && colorMode === 'light') {
    color = '#000000';
  } else if (color === '#000000' && colorMode === 'dark') {
    color = '#FFFFFF';
  }

  return (
    <Section className={className} display={'inline-flex'}>
      {Icon && <Icon color={color} className={styles.icon} />}
      <Text className={styles.label}>{label}</Text>
    </Section>
  );
}
