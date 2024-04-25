import { Flex, Heading, Link, Text } from '@chakra-ui/react';
import Head from 'next/head';

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
      <Head>
        <title>{article?.title} - ପ(๑•ᴗ•๑)ଓ ♡</title>
        <meta name="description" content={article?.description} />

        {/* SEO: Open Graph */}
        <meta property="og:image" content={article?.thumbnail}></meta>
        <meta property="og:title" content={article?.title}></meta>
        <meta property="og:description" content={article?.description}></meta>
        <meta property="og:type" content="article"></meta>
        <meta
          property="og:url"
          content={getURL() + '/blog/' + article?.slug}
        ></meta>

        {/* SEO: Twitter */}
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:image" content={article?.thumbnail}></meta>
        <meta name="twitter:title" content={article?.title}></meta>
        <meta name="twitter:description" content={article?.description}></meta>
        <meta name="twitter:site" content="@sammwy"></meta>
        <meta name="twitter:creator" content="@sammwy"></meta>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icon.png" />
      </Head>

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
