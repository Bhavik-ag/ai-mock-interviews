import { NextRequest, NextResponse } from "next/server";
import GenerateResults from "./generate-results";

export async function POST(request: NextRequest) {
  const { chat, interview_id } = await request.json();
  //   const results = await GenerateResults(chat);
  //   console.log("results ----------\n", results);
  // save it to db
  console.log(chat, interview_id);
  return NextResponse.json({});
}
