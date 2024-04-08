import Head from 'next/head';

import ArticleGrid from '@/components/utils/ArticleGrid';
import Article from '@/lib/article';
import { getURL } from '@/lib/utils';

interface ArticlesProps {
  articles: Article[];
}

export default function Articles({ articles }: ArticlesProps) {
  return (
    <>
      <Head>
        <title>/blog/ - ପ(๑•ᴗ•๑)ଓ ♡</title>
        <meta
          name="description"
          content={
            "Sammwy's Blog posts. Read some interesting articles about programming and related stuff."
          }
        />
      </Head>

      <ArticleGrid
        articles={articles}
        title={'Read some of my latest blog posts'}
        image={'/assets/anime/1.gif'}
      />
    </>
  );
}

export async function getServerSideProps() {
  const req = await fetch(`${getURL()}/api/articles?type=post`);
  const json = await req.json();
  return { props: { ...json } };
}
