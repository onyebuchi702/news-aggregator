import React, { useState } from "react";
import { Select } from "./ui";
import { FilterOptions } from "@/types";

interface FiltersProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    category: "",
    source: "",
    date: "",
  });

  const handleChange = (name: string, value: string) => {
    const newLocalFilters = { ...localFilters, [name]: value };
    setLocalFilters(newLocalFilters);

    const mappedFilters: Partial<FilterOptions> = {};

    if (newLocalFilters.category) {
      mappedFilters.categories = [newLocalFilters.category];
    } else {
      mappedFilters.categories = [];
    }

    if (newLocalFilters.source) {
      mappedFilters.sources = [newLocalFilters.source];
    } else {
      mappedFilters.sources = ["guardian", "newsapi", "nytimes"];
    }

    if (newLocalFilters.date) {
      const today = new Date();
      mappedFilters.dateTo = today.toISOString().split("T")[0];

      if (newLocalFilters.date === "today") {
        mappedFilters.dateFrom = today.toISOString().split("T")[0];
      } else if (newLocalFilters.date === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        mappedFilters.dateFrom = weekAgo.toISOString().split("T")[0];
      } else if (newLocalFilters.date === "month") {
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

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
      <Select
        label="Category"
        options={[
          { value: "", label: "All Categories" },
          { value: "technology", label: "Technology" },
          { value: "business", label: "Business" },
          { value: "sports", label: "Sports" },
        ]}
        value={localFilters.category}
        onChange={(e) => handleChange("category", e.target.value)}
      />
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
    </div>
  );
};
