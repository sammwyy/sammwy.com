export type LinkType =
  | 'source_code'
  | 'live_demo'
  | 'download'
  | 'buy'
  | 'docs'
  | 'view'
  | 'other'
  | 'website';

export type LinkVendor =
  // Source code
  | 'github'
  | 'custom'

  // App bundles
  | 'chocolatey'
  | 'npm'
  | 'maven'

  // App stores
  | 'playstore'
  | 'appstore'
  | 'windows_store'

  // Mod stores
  | 'curseforge'
  | 'modrinth'
  | 'builtbybit'

  // Game stores
  | 'itchio'
  | 'steam'
  | 'epic'
  | 'gog'
  | 'humble'
  | 'origin'
  | 'xbox'
  | 'playstation';

export interface ArticleLink {
  type: LinkType;
  vendor: LinkVendor;
  url: string;
}

export default interface Article {
  title: string;
  description: string;
  date: string;
  slug: string;
  thumbnail: string;
  content?: string;
  contentURL?: string;
  tags?: string[];
  links?: ArticleLink[];
}
