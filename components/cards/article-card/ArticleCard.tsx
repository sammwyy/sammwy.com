import { Box, Card, CardBody, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import DevBadge from '@/components/badges/dev-badge';
import Section from '@/components/content/section';
import useScreen from '@/hooks/useScreen';
import Article from '@/lib/article';

import styles from './ArticleCard.module.css';

export interface ArticleProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleProps) {
  const screen = useScreen();
  const { pathname } = useRouter();
  const link = `${pathname}/${article.slug}`;

  return (
    <Link href={link}>
      <Card
        className={styles.card}
        width={screen == 'mobile' ? '100%' : undefined}
      >
        <Image
          alt="Article thumbnail"
          className={styles.thumbnail}
          src={article.thumbnail}
        />

        <Section className={styles.section} borderRadius={'0'}>
          <CardBody className={styles.body}>
            <Text className={styles.title}>{article.title}</Text>
            <Text className={styles.description}>{article.description}</Text>

            <Box>
              {article.tags?.map((tag, index) => (
                <DevBadge key={`article-${article.title}-tag-${index}`}>
                  {tag}
                </DevBadge>
              ))}
            </Box>
          </CardBody>
        </Section>
      </Card>
    </Link>
  );
}
