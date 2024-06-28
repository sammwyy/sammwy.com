interface SkillGroup {
  title: string;
  skills: string[];
}

const languages: SkillGroup = {
  title: '☕ Languages',
  skills: [
    'Bash',
    'C#',
    'CSS',
    'HTML',
    'Java',
    'JavaScript',
    'Markdown',
    'Python',
    'Rust',
    'Sass',
    'SQL',
    'TypeScript',
  ],
};

const frameworks: SkillGroup = {
  title: '📚 Frameworks and Libraries',
  skills: [
    'Apollo',
    'Bootstrap',
    'Bun',
    'ChakraUI',
    '.NET',
    'Electron',
    'Express',
    'GitHub Actions',
    'GraphQL',
    'Hono',
    'Junit',
    'JWT',
    'NestJS',
    'NextJS',
    'Passport',
    'React',
    'Socket.IO',
    'TailwindCSS',
    'Tauri',
    'Unity',
    'Vite',
  ],
};

const tools: SkillGroup = {
  title: '🛠️ Tools',
  skills: [
    'Apache',
    'Apache Maven',
    'Debian',
    'Docker',
    'Git',
    'Gradle',
    'Insomnia',
    'Jenkins',
    'Nginx',
    'Notion',
    'OBS',
    'Trello',
    'Ubuntu',
    'Visual Studio Code',
  ],
};

const clouds: SkillGroup = {
  title: '☁️ Clouds and Providers',
  skills: [
    'Atlas',
    'AWS',
    'Cloudflare',
    'Cloudflare Workers',
    'GitHub',
    'GitHub Pages',
    'MariaDB',
    'MongoDB',
    'MySQL',
    'OVH',
    'Railway',
    'Redis',
    'Vercel',
  ],
};

const hardware: SkillGroup = {
  title: '🔌 Hardware',
  skills: ['Arduino', 'Bluetooth', 'RaspberryPI'],
};

const SKILLS: SkillGroup[] = [languages, frameworks, tools, clouds, hardware];

export default SKILLS;
