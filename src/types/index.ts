export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  category: string;
}

export interface NewsSource {
  id: string;
  name: string;
  enabled: boolean;
}

export interface FilterOptions {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  categories: string[];
  sources: string[];
  authors: string[];
}

export * from "./guardian";
export * from "./news";
export * from "./nytimes";
