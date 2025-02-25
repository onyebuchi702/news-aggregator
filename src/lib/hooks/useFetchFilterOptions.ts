"use client";
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FIVE_MINUTES } from "../constants";
import { FilterOptionsResponse } from "@/types";
import { apiAggregator } from "../api/api";

interface LocalFiltersState {
  category: string;
  source: string;
  author: string;
  date: string;
}

export const useFetchFilterOptions = () => {
  const [localFilters, setLocalFilters] = useState<LocalFiltersState>({
    category: "",
    source: "",
    date: "",
    author: "",
  });

  const fetchFilterOptions = useCallback(async (source?: string) => {
    const endpoint = source
      ? `/api/news/filter-options?source=${source}`
      : "/api/news/filter-options";

    const { data } = await apiAggregator.get<FilterOptionsResponse>(endpoint);
    return data;
  }, []);

  const {
    data: filterOptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["newsFilters", localFilters.source],
    queryFn: () => fetchFilterOptions(localFilters.source || undefined),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  const handleSourceChange = useCallback((source: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      source,
      category: "",
    }));
  }, []);

  const fetchSourceSpecificOptions = useCallback(
    (source: string) => {
      handleSourceChange(source);
    },
    [handleSourceChange]
  );

  return {
    filterOptions,
    isLoading,
    error,
    refetch,
    setLocalFilters,
    localFilters,
    fetchSourceSpecificOptions,
  };
};
