import { AxiosRequestConfig } from "axios";

export const guardianConfig = (): AxiosRequestConfig => {
  return {
    baseURL: process.env.NEXT_PUBLIC_GUARDIAN_API_URL,
    params: {
      "api-key": process.env.NEXT_PUBLIC_GUARDIAN_API_KEY,
    },
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
};

export const newsApiConfig = (): AxiosRequestConfig => ({
  baseURL: process.env.NEXT_PUBLIC_NEWS_API_URL,
  params: {
    apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const nyTimesConfig = (): AxiosRequestConfig => ({
  baseURL: process.env.NEXT_PUBLIC_NYT_API_URL,
  params: {
    "api-key": process.env.NEXT_PUBLIC_NYT_API_KEY,
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
