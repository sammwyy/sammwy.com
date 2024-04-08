import { Flex, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import * as FA from 'react-icons/fa';
import * as SI from 'react-icons/si';

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
  | 'vercel';

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
  rust: '#000000',
  sass: '#cc6699',
  solidity: '#363636',
  sql: '#f29111',
  typescript: '#007acc',
  apollo: '#311C87',
  bootstrap: '#7952b3',
  '.net': '#512BD4',
  electron: '#47848F',
  express: '#000000',
  'github-actions': '#2088FF',
  graphql: '#E10098',
  junit: '#25a162',
  nestjs: '#E0234E',
  nextjs: '#000000',
  react: '#61DAFB',
  tauri: '#A67C52',
  unity: '#000000',
  apache: '#D22128',
  'apache-maven': '#C71A36',
  debian: '#A80030',
  git: '#F05032',
  insomnia: '#5849BE',
  nginx: '#269539',
  notion: '#000000',
  obs: '#302E31',
  trello: '#0079BF',
  ubuntu: '#E95420',
  'visual-studio-code': '#007ACC',
  aws: '#FF9900',
  cloudflare: '#F38020',
  'github-pages': '#181717',
  mariadb: '#003545',
  mongodb: '#47A248',
  mysql: '#4479A1',
  redis: '#DC382D',
  vercel: '#000000',
};

export interface DevBadgeProps {
  icon?: DevBadgeIcon;
  children?: string;
}

export function DevBadge({ icon, children }: DevBadgeProps) {
  const label = children || '';
  const iconID =
    icon || (label.toLowerCase().replace(/ /g, '-') as DevBadgeIcon);
  const Icon = icons[iconID];

  return (
    <Flex className={styles.badge} display={'inline-flex'}>
      {Icon && <Icon color={colors[iconID]} className={styles.icon} />}
      <Text className={styles.label}>{label}</Text>
    </Flex>
  );
}
