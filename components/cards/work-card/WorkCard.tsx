import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import DevBadge from '@/components/badges/dev-badge';
import ArticleLinkButton from '@/components/buttons/article-link-btn';
import Section from '@/components/content/section';
import { ArticleLink } from '@/lib/article';

import styles from './WorkCard.module.css';

export interface WorkCardProps extends PropsWithChildren {
  title: string;
  logo: string;
  stack?: string[];
  links?: ArticleLink[];
}

export function WorkCard({
  title,
  logo,
  stack,
  links,
  children,
}: WorkCardProps) {
  return (
    <Section className={styles.section}>
      <Image src={logo} alt={title} borderRadius={'50%'} />
      <Heading className={styles.title}>{title}</Heading>
      <Box className={styles.description}>{children}</Box>

      {links && (
        <Flex gap={'5px'}>
          {links.map((link, index) => (
            <ArticleLinkButton key={index} link={link} />
          ))}
        </Flex>
      )}

      {stack && (
        <Box>
          {stack.map((s) => (
            <DevBadge key={s} size={'sm'}>
              {s}
            </DevBadge>
          ))}
        </Box>
      )}
    </Section>
  );
}
