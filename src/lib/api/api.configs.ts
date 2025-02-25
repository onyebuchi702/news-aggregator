import { AxiosRequestConfig } from "axios";

export const guardianConfig = (): AxiosRequestConfig => {
  return {
    baseURL: process.env.GUARDIAN_API_URL,
    params: {
      "api-key": process.env.GUARDIAN_API_KEY,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};

export const newsApiConfig = (): AxiosRequestConfig => ({
  baseURL: process.env.NEWS_API_URL,
  params: {
    apiKey: process.env.NEWS_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const nyTimesConfig = (): AxiosRequestConfig => ({
  baseURL: process.env.NYT_API_URL,
  params: {
    "api-key": process.env.NYT_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const aggregatorConfig = (): AxiosRequestConfig => ({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
