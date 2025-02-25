"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FIVE_MINUTES } from "../constants";
import { FilterOptionsResponse } from "@/types";
import { apiAggregator } from "../api/api";

export const useFetchFilterOptions = () => {
  const [localFilters, setLocalFilters] = useState({
    category: "",
    source: "",
    date: "",
    author: "",
  });

  const fetchFilterOptions = async () => {
    const { data } = await apiAggregator.get<FilterOptionsResponse>(
      "/api/news/filter-options"
    );

    return data;
  };

  const {
    data: filterOptions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["newsFilters", localFilters],
    queryFn: () => fetchFilterOptions(),
    staleTime: FIVE_MINUTES,
    refetchOnWindowFocus: false,
  });

  return {
    filterOptions,
    isLoading,
    error,
    refetch,
    setLocalFilters,
    localFilters,
  };
};
