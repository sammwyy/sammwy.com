import type { NextApiRequest, NextApiResponse } from 'next';

import Article from '@/lib/article';
import { getArticle } from '@/lib/articleFetcher';

type ResponseData = {
  article?: Article;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const articleSlug = req.query.slug;
  const articleType = req.query.type;

  if (!articleSlug) {
    res.status(400).json({ error: 'Missing article slug (?slug=...)' });
    return;
  }

  if (!articleType) {
    res.status(400).json({ error: 'Missing article type (?type=...)' });
    return;
  }

  const article = await getArticle(
    articleSlug as string,
    articleType as string,
  );

  if (!article) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }

  res.status(200).json({ article });
}
