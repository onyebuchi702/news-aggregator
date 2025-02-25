import { Article, FilterOptions } from "@/types";

export const filterByCategory = (
  articles: Article[],
  categories: string[]
): Article[] => {
  return articles.filter((article) => {
    if (!article.category) return false;

    const lowerCategory = article.category.toLowerCase();
    return categories.some((category) =>
      lowerCategory.includes(category.toLowerCase())
    );
  });
};

export const filterByAuthor = (
  articles: Article[],
  authors: string[]
): Article[] => {
  return articles.filter((article) => {
    if (!article.author) return false;

    const lowerAuthor = article.author.toLowerCase();
    return authors.some((author) => lowerAuthor.includes(author.toLowerCase()));
  });
};

export const applyFilters = (
  articles: Article[],
  filters: FilterOptions
): Article[] => {
  let filteredArticles = [...articles];

  if (filters.categories && filters.categories.length > 0) {
    filteredArticles = filterByCategory(filteredArticles, filters.categories);
  }

  if (filters.authors && filters.authors.length > 0) {
    filteredArticles = filterByAuthor(filteredArticles, filters.authors);
  }

  return filteredArticles;
};
