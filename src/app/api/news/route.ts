import { newsService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { FilterOptions } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: FilterOptions = {
      keyword: searchParams.get("keyword") || "",
      dateFrom: searchParams.get("dateFrom") || "",
      dateTo: searchParams.get("dateTo") || "",
      categories: searchParams.getAll("category") || [],
      sources: searchParams.getAll("source") || [],
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
