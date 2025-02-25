import { LRUCache } from "lru-cache";

type Options = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export const rateLimit = (options: Options) => {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval,
    ttl: options.interval,
  });

  return {
    check: (token: string, limit: number) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number) || 0;

        if (tokenCount >= limit) {
          reject(new Error("Rate limit exceeded"));
          return;
        }

        tokenCache.set(token, tokenCount + 1);
        resolve();
      }),
  };
};
