export interface NewsApiArticle {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  title: string;
  source: {
    id: string | null;
    name: string;
  };
  url: string;
  urlToImage: string;
}

export interface NewsApiResponse {
  data: {
    articles: NewsApiArticle[];
  };
  totalResults: number;
  status: string;
}
