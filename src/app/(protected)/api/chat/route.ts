import { NextRequest, NextResponse } from "next/server";
import AIResponse from "./AIResponse";
import DSAFollowup from "./DSAFollowup";
import handleCandidateQuestion from "./AnswerQuestion";

export async function POST(request: NextRequest) {
  try {
    const { question, raw_answer, type, code, candidateQuery } = await request.json();

    if (type === "dsa_followup" && question && code) {
      console.log(code);
      console.log(question);

      const result = await DSAFollowup(question, code);
      return NextResponse.json({ result });
    }

    if ((question || code) && type === "answer_question") {
      const result = await handleCandidateQuestion(question, code, candidateQuery);
      return NextResponse.json({ result });
    }

    if (question && raw_answer && type === "ai_response") {
      const result = await AIResponse(question, raw_answer);
      return NextResponse.json({ result });
    }

    throw new Error("Invalid request body");
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
function AnswerQuestion(question: any, code: any) {
  throw new Error("Function not implemented.");
}

