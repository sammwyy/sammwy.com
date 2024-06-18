import { ArticleLink } from '@/lib/article';

interface CurrentlyWork {
  title: string;
  logo: string;
  stack?: string[];
  description: string;
  links?: ArticleLink[];
}

const CURRENTLY: CurrentlyWork[] = [
  {
    title: 'StarOverlay',
    logo: 'https://avatars.githubusercontent.com/u/76667263?s=200&v=4',
    stack: ['TypeScript', 'React', 'GraphQL', 'Apollo'],
    description: 'Alerts, integrations and widget for your live streamings.',
    links: [
      {
        url: 'https://staroverlay.com',
        type: 'website',
        vendor: 'custom',
      },

      {
        url: 'https://github.com/staroverlay',
        type: 'source_code',
        vendor: 'github',
      },
    ],
  },
];

export default CURRENTLY;
