import { Flex, Heading, Link, Text } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';

import Section from '@/components/content/section';
import MarkdownRenderer from '@/components/utils/MarkdownRenderer';
import useScreen from '@/hooks/useScreen';
import Article from '@/lib/article';
import { getMarkdownChapters, getURL, headerToChapterID } from '@/lib/utils';

import { ArticleLinkButton } from '../buttons/article-link-btn';

interface ArticleRendererProps {
  article: Article;
}

export default function ArticleRenderer(props: ArticleRendererProps) {
  const { article } = props;
  const chapters = getMarkdownChapters(article?.content || '');
  const screen = useScreen();
  const isSmall = screen == 'tablet' || screen == 'mobile';

  return (
    <>
      <NextSeo
        title={`${article?.title} - ପ(๑•ᴗ•๑)ଓ ♡`}
        description={article?.description}
        canonical={getURL() + '/blog/' + article?.slug}
        twitter={{
          site: '@sammwy',
          cardType: 'summary_large_image',
          handle: '@sammwy',
        }}
        openGraph={{
          type: 'article',
          url: getURL() + '/blog/' + article?.slug,
          title: article?.title,
          description: article?.description,
          images: [
            {
              url: article?.thumbnail,
              alt: article?.title,
            },
          ],
        }}
      />

      <Flex width={'100%'} justifyContent={'center'} gap={'50px'}>
        {/* Sidebar */}
        {!isSmall && (
          <Section
            width={'30%'}
            maxW={'350px'}
            height={'fit-content'}
            flexDir={'column'}
            gap={'20px'}
            padding={'20px 30px'}
            position={'fixed'}
            left={'100px'}
            top={'130px'}
          >
            <Flex flexDir={'column'} gap={'10px'}>
              <Heading size={'md'} mt={'10px'}>
                Index
              </Heading>

              {chapters.map((chapter, index) => (
                <Link
                  key={`ar-chp-${index}`}
                  href={`#${headerToChapterID(chapter)}`}
                  style={{
                    textDecoration: 'none',
                  }}
                  _hover={{
                    color: 'purple.400',
                  }}
                >
                  <Text>
                    {index + 1}. {chapter}
                  </Text>
                </Link>
              ))}
            </Flex>
          </Section>
        )}

        {/* Content */}
        <Flex
          width={'95%'}
          maxW={'800px'}
          height={'100%'}
          flexDir={'column'}
          gap={'20px'}
        >
          <Flex
            width={'100%'}
            height={'100%'}
            minHeight={'300px'}
            bg={`url(${article?.thumbnail})`}
            bgSize={'cover'}
            bgPosition={'center'}
            bgRepeat={'no-repeat'}
            borderRadius={'10px'}
          >
            <Flex
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              borderRadius={'10px'}
            >
              <Heading>{article?.title}</Heading>
            </Flex>
          </Flex>

          {article?.links && (
            <Section
              display={'box'}
              height={'100%'}
              padding={'20px 30px'}
              margin={'auto'}
            >
              {article.links.map((link, index) => (
                <ArticleLinkButton key={index} link={link} />
              ))}
            </Section>
          )}

          <Section
            height={'100%'}
            flexDir={'column'}
            gap={'20px'}
            padding={'20px 30px'}
          >
            <MarkdownRenderer>
              {article?.content || 'Error fetching content.'}
            </MarkdownRenderer>
          </Section>
        </Flex>
      </Flex>
    </>
  );
}
