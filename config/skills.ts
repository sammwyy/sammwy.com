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
    'ChakraUI',
    '.NET',
    'Electron',
    'Express',
    'GitHub Actions',
    'GraphQL',
    'Junit',
    'NestJS',
    'NextJS',
    'React',
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
    'Git',
    'Insomnia',
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
    'AWS',
    'Cloudflare',
    'GitHub Pages',
    'MariaDB',
    'MongoDB',
    'MySQL',
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
