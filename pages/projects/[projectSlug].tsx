import { NextPageContext } from 'next';

import Error from '@/components/content/error/Error';
import ArticleRenderer from '@/components/utils/ArticleRenderer';
import Article from '@/lib/article';
import { getURL } from '@/lib/utils';

interface ProjectPageProps {
  article?: Article | null;
  error?: string | null;
}

export default function ProjectPage(props: ProjectPageProps) {
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
  const projectSlug = query.projectSlug;
  const req = await fetch(
    `${getURL()}/api/article?slug=${projectSlug}&type=project`,
  );
  const json = await req.json();
  return { props: { ...json } };
}
