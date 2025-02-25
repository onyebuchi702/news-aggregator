import { newsService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import { handleFilterOptionsRateLimit } from "@/lib";

export async function GET(request: NextRequest) {
  try {
    await handleFilterOptionsRateLimit(request);
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get("source") || "";

    const [authors, categories] = await Promise.all([
      newsService.getUniqueAuthors(source || undefined),
      newsService.getUniqueCategories(source || undefined),
    ]);

    return NextResponse.json(
      {
        authors,
        categories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return NextResponse.json(
      { error: "Failed to fetch filter options" },
      { status: 500 }
    );
  }
}
