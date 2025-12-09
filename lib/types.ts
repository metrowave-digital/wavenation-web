// lib/types.ts

export interface MediaItem {
  url: string;
}

export interface Article {
  title: string;
  slug: string;
  subtitle?: string;
  publishedDate?: string;
  heroImage?: MediaItem | null;
}

export interface ArticlesQueryResponse {
  Articles: {
    docs: Article[];
  };
}
