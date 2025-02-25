"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { NewsCard } from "./NewsCard";
import { SearchBar } from "./SearchBar";
import { Filters } from "./Filters";
import { newsService } from "@/services";
import { FilterOptions } from "@//types";

const FIVE_MINUTES = 5 * 60 * 1000;

export const NewsFeed: React.FC = () => {
  const initialState: FilterOptions = {
    keyword: "",
    dateFrom: "",
    dateTo: "",
    categories: [],
    sources: ["guardian", "newsapi", "nytimes"],
    authors: [],
  };

  const [filters, setFilters] = useState<FilterOptions>(initialState);

  const {
    data: articles,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["news", filters],
    queryFn: () => newsService.fetchAllNews(filters),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, keyword: query }));
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-black">
      <h1 className="text-3xl font-bold mb-8">News Aggregator</h1>

      <div className="mb-6">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="mb-8">
        <Filters onFilterChange={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Failed to load news. Please try again later.</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : articles && articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No articles found matching your criteria.
          </p>
          <button
            onClick={() => setFilters(initialState)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}

      {articles && articles.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {articles.length} articles
        </div>
      )}
    </div>
  );
};
