// app/api/save-results/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("x-insights"); // Replace with your actual DB name

    await db.collection("quiz_submissions").insertOne({
      ...data,
      submittedAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Database insertion failed" },
      { status: 500 },
    );
  }
}
