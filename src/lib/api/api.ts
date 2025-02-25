import axios, { AxiosInstance } from "axios";
import { ApiRequestMethod } from "@/lib";
import {
  guardianConfig,
  newsApiConfig,
  nyTimesConfig,
  aggregatorConfig,
} from "./api.configs";

interface IApi {
  [ApiRequestMethod.GET]: <T>(path: string) => Promise<T>;
  [ApiRequestMethod.POST]: <T>(
    path: string,
    data: Record<string, string | number | { [key: string]: string }>
  ) => Promise<T>;
  [ApiRequestMethod.PATCH]: <T>(path: string) => Promise<T>;
  [ApiRequestMethod.DELETE]: <T>(path: string) => Promise<T>;
}

class ApiService implements IApi {
  private httpService: AxiosInstance;

  constructor(httpService: AxiosInstance) {
    this.httpService = httpService;
  }

  public async get<T>(path: string): Promise<T> {
    return await this.httpService.get(path);
  }

  public async post<T>(
    path: string,
    data: Record<string, string | number | { [key: string]: string }>
  ): Promise<T> {
    return await this.httpService.post(path, data);
  }

  public patch<T>(): Promise<T> {
    throw new Error("method not implemented");
  }

  public delete<T>(): Promise<T> {
    throw new Error("method not implemented");
  }
}

export const apiGuardian = new ApiService(axios.create(guardianConfig()));
export const apiNewsApi = new ApiService(axios.create(newsApiConfig()));
export const apiNyTimes = new ApiService(axios.create(nyTimesConfig()));
export const apiAggregator = new ApiService(axios.create(aggregatorConfig()));
