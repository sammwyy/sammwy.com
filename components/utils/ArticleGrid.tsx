import { Flex, Heading, Image, SimpleGrid } from '@chakra-ui/react';

import ArticleCard from '@/components/cards/article-card';
import Article from '@/lib/article';

export interface ArticleGridProps {
  articles: Article[];
  title: string;
  image?: string;
}

export default function ArticleGrid({
  articles,
  title,
  image,
}: ArticleGridProps) {
  return (
    <Flex flexDir={'column'} width={'90%'} margin={'auto'} gap={'100px'}>
      {/* Blog posts */}
      <Flex
        alignItems={'center'}
        flexDir={'column'}
        gap={'50px'}
        id="blog"
        p={'50px 0'}
      >
        <Flex
          alignItems={'center'}
          flexDir={'column'}
          textAlign={'center'}
          gap={'10px'}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              width={'350px'}
              height={'200px'}
              objectFit={'cover'}
            />
          )}

          <Heading fontWeight={'light'}>{title}</Heading>
        </Flex>

        <SimpleGrid
          minChildWidth="300px"
          spacingX="20px"
          spacingY="40px"
          width={'95%'}
          maxWidth={'1000px'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          {articles.map((article, index) => (
            <ArticleCard article={article} key={index} />
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}
