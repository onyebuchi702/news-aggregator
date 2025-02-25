import React from "react";
import { Select } from "./ui/Select";
import { FilterOptions } from "@/types";

interface FiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState({
    category: "",
    source: "",
    date: "",
  });

  const handleChange = (name: string, value: string) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
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
        value={filters.category}
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
        value={filters.source}
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
        value={filters.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />
    </div>
  );
};
