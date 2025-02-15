import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
  try {
    const res = await fetch("https://zenquotes.io/api/random");
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching the quote", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 },
    );
  }
}
