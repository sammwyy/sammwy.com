import type { NextApiRequest, NextApiResponse } from 'next';

import Article from '@/lib/article';
import { getArticles } from '@/lib/articleFetcher';

type ResponseData = {
  articles: Article[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const articleType = req.query.type;
  res.status(200).json({ articles: getArticles(articleType as string) });
}
