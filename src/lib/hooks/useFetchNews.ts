"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterOptions, Article, AggregatorResponse } from "@/types";
import { FIVE_MINUTES } from "../constants";
import { apiAggregator } from "../api/api";

export const useFetchNews = () => {
  const initialState: FilterOptions = {
    keyword: "",
    dateFrom: "",
    dateTo: "",
    categories: [],
    sources: ["guardian", "newsapi", "nytimes"],
    authors: [],
  };

  const [filters, setFilters] = useState<FilterOptions>(initialState);

  const fetchNews = async (): Promise<Article[]> => {
    try {
      const params = new URLSearchParams();

      if (filters.keyword) params.append("keyword", filters.keyword);
      if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.append("dateTo", filters.dateTo);

      filters.categories.forEach((category) => {
        params.append("category", category);
      });

      filters.sources.forEach((source) => {
        params.append("source", source);
      });

      filters.authors.forEach((author) => {
        params.append("author", author);
      });

      const {
        data: { articles },
      } = await apiAggregator.get<AggregatorResponse>(
        `/api/news?${params.toString()}`
      );

      return articles;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw new Error("Failed to fetch news");
    }
  };

  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news", filters],
    queryFn: () => fetchNews(),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  return {
    filters,
    initialState,
    setFilters,
    data: articles,
    isLoading,
    error,
    refetch,
  };
};
