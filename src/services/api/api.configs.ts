import { AxiosRequestConfig } from "axios";

export const guardianConfig = (): AxiosRequestConfig => ({
  baseURL: "https://content.guardianapis.com",
  params: {
    "api-key": process.env.NEXT_PUBLIC_GUARDIAN_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const newsApiConfig = (): AxiosRequestConfig => ({
  baseURL: "https://newsapi.org/v2",
  params: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const nyTimesConfig = (): AxiosRequestConfig => ({
  baseURL: "https://api.nytimes.com/svc/search/v2",
  params: {
    "api-key": process.env.NEXT_PUBLIC_NYT_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
