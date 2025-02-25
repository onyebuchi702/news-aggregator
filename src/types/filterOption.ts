export interface FilterOptionsData {
  authors: string[];
  categories: string[];
}

export interface FilterOptionsResponse {
  data: {
    authors: string[];
    categories: string[];
  };
}
