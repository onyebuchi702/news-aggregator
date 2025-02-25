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

export interface FilterOptions {
  keyword: string;
  dateFrom: string;
  dateTo: string;
  categories: string[];
  sources: string[];
}

export interface AggregatorResponse {
  data: {
    articles: Article[];
  };
}

export * from "./guardian";
export * from "./news";
export * from "./nytimes";
