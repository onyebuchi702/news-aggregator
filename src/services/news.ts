import { Article, FilterOptions } from "../types";
import {
  apiGuardian,
  apiNewsApi,
  apiNyTimes,
  applyFilters,
  FIVE_MINUTES,
} from "../lib";
import {
  GuardianApiResponse,
  NyTimesResponse,
  NewsApiResponse,
  GuardianFieldsResult,
  NewsApiArticle,
  NyTimesResponseDoc,
} from "@/types";

let cachedAuthors: Record<string, string[]> = {};
let cachedCategories: Record<string, string[]> = {};
let cacheTimestamp: number | null = null;
const CACHE_TTL = FIVE_MINUTES;

const validNewsApiCategories = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

const categoryMapping: Record<string, string> = {
  Business: "business",
  "US news": "general",
  "World news": "general",
  "UK news": "general",
  Film: "entertainment",
  Politics: "general",
  Global: "general",
  Sport: "sports",
  Law: "general",
  "Australia news": "general",
  Music: "entertainment",
  "Television & radio": "entertainment",
};

class NewsAggregatorService {
  async fetchAllNews(filters: FilterOptions): Promise<Article[]> {
    const promises: Promise<Article[]>[] = [];

    if (filters.sources.length === 0 || filters.sources.includes("guardian")) {
      promises.push(this.fetchGuardianNews(filters));
    }

    if (filters.sources.length === 0 || filters.sources.includes("newsapi")) {
      const newsApiFilters = { ...filters };

      if (newsApiFilters.categories.length) {
        newsApiFilters.categories = newsApiFilters.categories
          .map((category) => {
            return categoryMapping[category] || "general";
          })
          .filter((category) => validNewsApiCategories.includes(category));

        if (newsApiFilters.categories.length === 0) {
          newsApiFilters.categories = ["general"];
        }
      }

      promises.push(this.fetchNewsApiArticles(newsApiFilters));
    }

    if (filters.sources.length === 0 || filters.sources.includes("nytimes")) {
      promises.push(this.fetchNYTimesNews(filters));
    }

    const results = await Promise.allSettled(promises);
    let articles: Article[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        articles.push(...result.value);
      }
    });

    articles = this.deduplicateArticles(articles);

    articles = applyFilters(articles, filters);

    return articles;
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

      return data.response.results.map((item: GuardianFieldsResult) => ({
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

      let selectedCategory = "general";
      if (filters.categories.length) {
        for (const category of filters.categories) {
          const mappedCategory = categoryMapping[category] || category;
          if (validNewsApiCategories.includes(mappedCategory)) {
            selectedCategory = mappedCategory;
            break;
          }
        }
      }

      queryParams.append("q", filters.keyword || "news");

      let endpoint = "/everything";

      if (validNewsApiCategories.includes(selectedCategory)) {
        endpoint = "/top-headlines";
        queryParams.append("category", selectedCategory);
        queryParams.append("country", "us");
      }

      const path = `${endpoint}?${queryParams.toString()}&pageSize=50&language=en`;

      const { data } = await apiNewsApi.get<NewsApiResponse>(path);

      return data.articles.map((item: NewsApiArticle) => {
        return {
          id: item.url,
          title: item.title,
          description: item.description,
          content: item.content,
          author: item.author,
          source: item.source.name,
          publishedAt: item.publishedAt,
          url: item.url,
          imageUrl: item.urlToImage,
          category: selectedCategory,
        };
      });
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

      return data.response.docs.map((item: NyTimesResponseDoc) => ({
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

  async getUniqueAuthors(source?: string): Promise<string[]> {
    const cacheKey = source || "all";

    if (
      cachedAuthors[cacheKey] &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedAuthors[cacheKey];
    }

    const filters: FilterOptions = {
      keyword: "",
      dateFrom: "",
      dateTo: "",
      categories: [],
      sources: source ? [source] : [],
      authors: [],
    };

    const articles = await this.fetchAllNews(filters);

    const uniqueAuthors = new Set<string>();
    articles.forEach((article) => {
      if (article.author && article.author.trim()) {
        uniqueAuthors.add(article.author);
      }
    });

    cachedAuthors[cacheKey] = Array.from(uniqueAuthors).slice(0, 10);
    if (!cacheTimestamp) cacheTimestamp = Date.now();

    return cachedAuthors[cacheKey];
  }

  async getUniqueCategories(source?: string): Promise<string[]> {
    const cacheKey = source || "all";

    if (
      cachedCategories[cacheKey] &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_TTL
    ) {
      return cachedCategories[cacheKey];
    }

    if (source === "newsapi") {
      cachedCategories[cacheKey] = validNewsApiCategories.map(
        (category) => category.charAt(0).toUpperCase() + category.slice(1)
      );
      if (!cacheTimestamp) cacheTimestamp = Date.now();
      return cachedCategories[cacheKey];
    }

    const filters: FilterOptions = {
      keyword: "",
      dateFrom: "",
      dateTo: "",
      categories: [],
      sources: source ? [source] : [],
      authors: [],
    };

    const articles = await this.fetchAllNews(filters);

    const uniqueCategories = new Set<string>();
    articles.forEach((article) => {
      if (article.category && article.category.trim()) {
        uniqueCategories.add(article.category);
      }
    });

    cachedCategories[cacheKey] = Array.from(uniqueCategories).slice(0, 10);
    if (!cacheTimestamp) cacheTimestamp = Date.now();

    return cachedCategories[cacheKey];
  }
}

export const newsService = new NewsAggregatorService();
