import { newsService } from "@/services";
import { NextRequest, NextResponse } from "next/server";
import {
  rateLimit,
  ONE_MINUTE,
  USERS_PER_INTERVAL,
  METADATA_REQUESTS_PER_MINUTE,
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
      await limiter.check(`${ip}-metadata`, METADATA_REQUESTS_PER_MINUTE);
    } catch (error) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const [authors, categories] = await Promise.all([
      newsService.getUniqueAuthors(),
      newsService.getUniqueCategories(),
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
