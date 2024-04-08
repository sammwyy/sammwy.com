import Head from 'next/head';

import ArticleGrid from '@/components/utils/ArticleGrid';
import Article from '@/lib/article';
import { getURL } from '@/lib/utils';

interface ProjectsProps {
  articles: Article[];
}

export default function Projects({ articles }: ProjectsProps) {
  return (
    <>
      <Head>
        <title>/projects/ - ପ(๑•ᴗ•๑)ଓ ♡</title>
        <meta
          name="description"
          content={
            "Sammwy's Projects. Discover some of the projects I've worked on."
          }
        />
      </Head>
      <ArticleGrid
        articles={articles}
        title={'Discover some of my projects'}
        image={'/assets/anime/2.gif'}
      />
    </>
  );
}

export async function getServerSideProps() {
  const req = await fetch(`${getURL()}/api/articles?type=project`);
  const json = await req.json();
  return { props: { ...json } };
}
