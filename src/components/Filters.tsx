import React from "react";
import { Select } from "./ui";
import { FilterOptions } from "@/types";
import { useFetchFilterOptions } from "@/lib";

interface FiltersProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const {
    setLocalFilters,
    localFilters,
    filterOptions,
    isLoading,
    error,
    fetchSourceSpecificOptions,
  } = useFetchFilterOptions();

  const handleChange = (name: string, value: string) => {
    if (name === "source") {
      fetchSourceSpecificOptions(value);
    } else {
      setLocalFilters({ ...localFilters, [name]: value });
    }

    const mappedFilters: Partial<FilterOptions> = {};

    const updatedFilters =
      name === "category"
        ? { ...localFilters, category: value }
        : name === "source"
        ? { ...localFilters, source: value, category: "" }
        : { ...localFilters, [name]: value };

    if (updatedFilters.category) {
      mappedFilters.categories = [updatedFilters.category];
    } else {
      mappedFilters.categories = [];
    }

    if (updatedFilters.source) {
      mappedFilters.sources = [updatedFilters.source];
    } else {
      mappedFilters.sources = ["guardian", "newsapi", "nytimes"];
    }

    if (updatedFilters.author) {
      mappedFilters.authors = [updatedFilters.author];
    } else {
      mappedFilters.authors = [];
    }

    if (updatedFilters.date) {
      const today = new Date();
      mappedFilters.dateTo = today.toISOString().split("T")[0];

      if (updatedFilters.date === "today") {
        mappedFilters.dateFrom = today.toISOString().split("T")[0];
      } else if (updatedFilters.date === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        mappedFilters.dateFrom = weekAgo.toISOString().split("T")[0];
      } else if (updatedFilters.date === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        mappedFilters.dateFrom = monthAgo.toISOString().split("T")[0];
      }
    } else {
      mappedFilters.dateFrom = "";
      mappedFilters.dateTo = "";
    }

    onFilterChange(mappedFilters);
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...(filterOptions?.categories?.map((category) => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
    })) || []),
  ];

  const authorOptions = [
    { value: "", label: "All Authors" },
    ...(filterOptions?.authors?.map((author) => ({
      value: author,
      label: author,
    })) || []),
  ];

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Select
        label="Source"
        options={[
          { value: "", label: "All Sources" },
          { value: "guardian", label: "The Guardian" },
          { value: "nytimes", label: "New York Times" },
          { value: "newsapi", label: "News API" },
        ]}
        value={localFilters.source}
        onChange={(e) => handleChange("source", e.target.value)}
      />

      <Select
        label="Category"
        options={categoryOptions}
        value={localFilters.category}
        onChange={(e) => handleChange("category", e.target.value)}
        disabled={isLoading}
      />

      <Select
        label="Date"
        options={[
          { value: "", label: "All Time" },
          { value: "today", label: "Today" },
          { value: "week", label: "This Week" },
          { value: "month", label: "This Month" },
        ]}
        value={localFilters.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />

      <Select
        label="Author"
        options={authorOptions}
        value={localFilters.author}
        onChange={(e) => handleChange("author", e.target.value)}
        disabled={isLoading}
      />

      {error && (
        <div className="w-full text-sm text-red-500">
          {(error as Error).message || "An error occurred with filter options"}
        </div>
      )}
    </div>
  );
};
