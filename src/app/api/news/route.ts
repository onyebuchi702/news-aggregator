import { newsService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { FilterOptions } from "@/types";
import {
  rateLimit,
  ONE_MINUTE,
  USERS_PER_INTERVAL,
  ARTICLES_REQUESTS_PER_MINUTE,
} from "@/lib";

const limiter = rateLimit({
  interval: ONE_MINUTE,
  uniqueTokenPerInterval: USERS_PER_INTERVAL,
});

export async function GET(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "anonymous";

    try {
      await limiter.check(ip, ARTICLES_REQUESTS_PER_MINUTE);
    } catch (error) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    const filters: FilterOptions = {
      keyword: searchParams.get("keyword") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      categories: searchParams.getAll("category") || [],
      sources: searchParams.getAll("source") || [],
      authors: searchParams.getAll("author") || [],
    };

    const articles = await newsService.fetchAllNews(filters);

    return NextResponse.json({ articles }, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
