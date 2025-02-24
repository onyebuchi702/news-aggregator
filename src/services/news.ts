import { Article, FilterOptions } from "../types";
import { apiGuardian, apiNewsApi, apiNyTimes } from "./api/api";
import { GuardianApiResponse, NyTimesResponse, NewsApiResponse } from "@/types";

class NewsAggregatorService {
  async fetchAllNews(filters: FilterOptions): Promise<Article[]> {
    const promises: Promise<Article[]>[] = [];

    if (filters.sources.includes("guardian")) {
      promises.push(this.fetchGuardianNews(filters));
    }

    if (filters.sources.includes("newsapi")) {
      promises.push(this.fetchNewsApiArticles(filters));
    }

    if (filters.sources.includes("nytimes")) {
      promises.push(this.fetchNYTimesNews(filters));
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

      const { data } = await apiGuardian.get<GuardianApiResponse>(path);

      return data.response.results.map((item: any) => ({
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

  private async fetchNewsApiArticles(
    filters: FilterOptions
  ): Promise<Article[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.dateFrom) queryParams.append("from", filters.dateFrom);
      if (filters.dateTo) queryParams.append("to", filters.dateTo);
      if (filters.categories.length)
        queryParams.append("category", filters.categories[0]);

      queryParams.append("q", filters.keyword || "news");

      const path = `/everything?${queryParams.toString()}&pageSize=50&language=en`;

      const { data } = await apiNewsApi.get<NewsApiResponse>(path);

      return data.articles.map((item: any) => ({
        id: item.url,
        title: item.title,
        description: item.description,
        content: item.content,
        author: item.author,
        source: item.source.name,
        publishedAt: item.publishedAt,
        url: item.url,
        imageUrl: item.urlToImage,
        category: "general",
      }));
    } catch (error) {
      console.error("Error fetching NewsAPI articles:", error);
      return [];
    }
  }

  private async fetchNYTimesNews(filters: FilterOptions): Promise<Article[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters.keyword) queryParams.append("q", filters.keyword);
      if (filters.dateFrom)
        queryParams.append("begin_date", filters.dateFrom.replace(/-/g, ""));
      if (filters.dateTo)
        queryParams.append("end_date", filters.dateTo.replace(/-/g, ""));

      let fq = "";
      if (filters.categories.length) {
        fq = filters.categories.map((cat) => `news_desk:(${cat})`).join(" OR ");
        queryParams.append("fq", fq);
      }

      const path = `/articlesearch.json?${queryParams.toString()}`;
      const { data } = await apiNyTimes.get<NyTimesResponse>(path);

      return data.response.docs.map((item: any) => ({
        id: item._id,
        title: item.headline.main,
        description: item.abstract,
        content: item.lead_paragraph,
        author: item.byline?.original || "",
        source: "New York Times",
        publishedAt: item.pub_date,
        url: item.web_url,
        imageUrl: item.multimedia[0]?.url
          ? `https://www.nytimes.com/${item.multimedia[0].url}`
          : undefined,
        category: item.news_desk,
      }));
    } catch (error) {
      console.error("Error fetching NYT news:", error);
      return [];
    }
  }
}

export const newsService = new NewsAggregatorService();
