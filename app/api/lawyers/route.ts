import { NextRequest, NextResponse } from "next/server";
import { getLawyerSearch } from "../../lib/backend";

export async function GET(request: NextRequest) {
  return NextResponse.json(getLawyerSearch(request.nextUrl.searchParams));
}
