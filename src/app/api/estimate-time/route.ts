import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const taskDescription = body?.message;

    if (!taskDescription || typeof taskDescription !== "string") {
      console.error("Invalid task description:", taskDescription);
      return NextResponse.json(
        { error: "A valid task description is required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Missing API key");
      return NextResponse.json(
        { error: "API key is missing" },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI specialized in tasks and productivity using the Pomodoro technique that estimates the time needed to complete tasks. Your output should be only the seconds (a number) estimated for the task, without any additional text. For example, if the task should take 300 seconds, simply output 300. Estimate the time I need for this task: ${taskDescription}.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Regex
    const digitsMatch = responseText.match(/\d+/);
    const estimatedTime = digitsMatch ? parseInt(digitsMatch[0], 10) : 0;

    if (estimatedTime <= 0) {
      return NextResponse.json(
        { error: "Invalid estimated time" },
        { status: 500 },
      );
    }

    return NextResponse.json({ taskDescription, estimatedTime });
  } catch (error) {
    console.error("Error estimating time:", error);
    return NextResponse.json(
      {
        error: "Failed to estimate time",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
