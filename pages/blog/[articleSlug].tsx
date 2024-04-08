import { NextPageContext } from 'next';

import Error from '@/components/content/error/Error';
import ArticleRenderer from '@/components/utils/ArticleRenderer';
import Article from '@/lib/article';
import { getURL } from '@/lib/utils';

interface ArticlePageProps {
  article?: Article | null;
  error?: string | null;
}

export default function ArticlePage(props: ArticlePageProps) {
  const { article, error } = props;

  if (!article || error) {
    return (
      <Error title={error || 'Unknown Error'}>
        Check the URL and try again.
      </Error>
    );
  }

  return <ArticleRenderer article={article} />;
}

export async function getServerSideProps({ query }: NextPageContext) {
  const articleSlug = query.articleSlug;
  const req = await fetch(
    `${getURL()}/api/article?slug=${articleSlug}&type=post`,
  );
  const json = await req.json();
  return { props: { ...json } };
}
