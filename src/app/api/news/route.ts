import { newsService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { FilterOptions } from "@/types";
import { rateLimit } from "@/lib";

const ONE_MINUTE = 60 * 1000;

const limiter = rateLimit({
  interval: ONE_MINUTE,
  uniqueTokenPerInterval: 500,
});

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    console.log("====================================");
    console.log({
      ip,
    });
    console.log("====================================");
    try {
      await limiter.check(ip, 10);
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
