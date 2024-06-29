import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

import Article from './article';
import { getURL } from './utils';

function mustCache() {
  return process.env.NODE_ENV === 'production';
}

class ArticleFetcher {
  private cached: Article[] | null;
  private cachedContent: { [key: string]: string };
  private directory: string;

  constructor(directory: string) {
    this.cached = null;
    this.cachedContent = {};
    this.directory = directory;
  }

  resolveArticles() {
    const dir = path.resolve('./public', this.directory);
    const children = fs.readdirSync(dir);

    const articles = children.map((child) => {
      const jsonPath = path.join(child, 'article.json');
      const rawJson = fs.readFileSync(path.join(dir, jsonPath), 'utf-8');
      const json = JSON.parse(rawJson);
      return {
        ...json,
        slug: child,
        thumbnail: `${getURL()}/${this.directory}/${child}/thumbnail.jpg`,
      };
    });

    return articles;
  }

  getArticles() {
    if (this.cached && mustCache()) {
      return this.cached;
    }

    const articles = this.resolveArticles();
    if (mustCache()) {
      this.cached = articles;
    }
    return articles;
  }

  async getArticle(slug: string) {
    const articles = this.getArticles();
    const article = articles.find(
      (article) => article.slug.toLowerCase() === slug.toLowerCase(),
    );

    if (article) {
      if (mustCache() && this.cachedContent[article.slug]) {
        article.content = this.cachedContent[article.slug];
      } else if (article.contentURL) {
        const req = await fetch(article.contentURL);
        const content = await req.text();
        this.cachedContent[article.slug] = content;
        article.content = content;
      } else {
        const contentPath = path.resolve(
          './public',
          this.directory,
          article.slug,
          'content.md',
        );
        const content = fs.readFileSync(contentPath, 'utf-8');
        this.cachedContent[article.slug] = content;
        article.content = content;
      }
    }

    while (article.content.includes('{{media:')) {
      const start = article.content.indexOf('{{media:');
      const end = article.content.indexOf('}}', start);
      const media = article.content.slice(start + 8, end);
      const mediaURL = `/${this.directory}/${article.slug}/media/${media}`;
      article.content = article.content.replace(`{{media:${media}}}`, mediaURL);
    }

    return article || null;
  }

  getLastArticles(limit: number) {
    const articles = this.getArticles();
    const sorted = articles.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return sorted.slice(0, limit);
  }
}

export const Posts = new ArticleFetcher('posts');
export const Projects = new ArticleFetcher('projects');

export function getArticles(type: string) {
  if (type === 'post') {
    return Posts.getArticles();
  } else if (type === 'project') {
    return Projects.getArticles();
  }

  return [];
}

export async function getArticle(slug: string, type: string) {
  if (type === 'post') {
    return await Posts.getArticle(slug);
  } else if (type === 'project') {
    return await Projects.getArticle(slug);
  }

  return null;
}

export function getLastArticles(limit: number, type: string) {
  if (type === 'post') {
    return Posts.getLastArticles(limit);
  } else if (type === 'project') {
    return Projects.getLastArticles(limit);
  }

  return [];
}
