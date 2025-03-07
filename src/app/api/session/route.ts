import { NextResponse } from "next/server";
import { OPENAI_API_BASE_URL, OPENAI_REALTIME_MODEL } from "@/app/lib/constants";

export async function GET() {
  try {
    const response = await fetch(
      `${OPENAI_API_BASE_URL}/realtime/sessions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_REALTIME_MODEL,
        }),
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
