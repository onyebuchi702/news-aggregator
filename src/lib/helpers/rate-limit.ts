import { LRUCache } from "lru-cache";
import { NextRequest, NextResponse } from "next/server";
import {
  ARTICLES_REQUESTS_PER_MINUTE,
  ONE_MINUTE,
  USERS_PER_INTERVAL,
  METADATA_REQUESTS_PER_MINUTE,
} from "../constants";

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

const limiter = rateLimit({
  interval: ONE_MINUTE,
  uniqueTokenPerInterval: USERS_PER_INTERVAL,
});

const getIpAddress = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0] : "anonymous";

  return ip;
};

export const handleNewsRateLimit = async (request: NextRequest) => {
  const ip = getIpAddress(request);

  try {
    await limiter.check(ip, ARTICLES_REQUESTS_PER_MINUTE);
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }
};

export const handleFilterOptionsRateLimit = async (request: NextRequest) => {
  const ip = getIpAddress(request);

  try {
    await limiter.check(`${ip}-metadata`, METADATA_REQUESTS_PER_MINUTE);
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    );
  }
};
