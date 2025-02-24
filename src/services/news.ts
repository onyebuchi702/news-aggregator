import { Article, FilterOptions } from "../types";
import { apiGuardian } from "./api/api";

class NewsAggregatorService {
  async fetchAllNews(filters: FilterOptions): Promise<Article[]> {
    const promises: Promise<Article[]>[] = [];

    if (filters.sources.includes("guardian")) {
      promises.push(this.fetchGuardianNews(filters));
    }

    const results = await Promise.allSettled(promises);
    const articles: Article[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        articles.push(...result.value);
      }
    });

    return this.deduplicateArticles(articles);
  }

  private deduplicateArticles(articles: Article[]): Article[] {
    const seen = new Set();
    return articles.filter((article) => {
      const duplicate = seen.has(article.title);
      seen.add(article.title);
      return !duplicate;
    });
  }

  private async fetchGuardianNews(filters: FilterOptions): Promise<Article[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append("q", filters.keyword);
      if (filters.dateFrom) queryParams.append("from-date", filters.dateFrom);
      if (filters.dateTo) queryParams.append("to-date", filters.dateTo);
      if (filters.categories.length)
        queryParams.append("section", filters.categories.join("|"));

      const path = `/search?${queryParams.toString()}&show-fields=thumbnail,trailText,byline&page-size=50`;

      const response = await apiGuardian.get<any>(path);

      return response.data.response.results.map((item: any) => ({
        id: item.id,
        title: item.webTitle,
        description: item.fields?.trailText || "",
        content: "",
        author: item.fields?.byline || "",
        source: "The Guardian",
        publishedAt: item.webPublicationDate,
        url: item.webUrl,
        imageUrl: item.fields?.thumbnail,
        category: item.sectionName,
      }));
    } catch (error) {
      console.error("Error fetching Guardian news:", error);
      return [];
    }
  }
}

export const newsService = new NewsAggregatorService();
