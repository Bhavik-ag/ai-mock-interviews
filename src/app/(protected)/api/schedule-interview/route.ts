import { schedule_user_interview } from "@/app/actions/schedule_user_interview";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { interviewId, interviewSlug, date } = await request.json();
  const interviewUrl = await schedule_user_interview(
    interviewId,
    interviewSlug,
    date == null ? null : new Date(date)
  );

  //TODO: Send mail trough Resend API
  return NextResponse.json({ interviewUrl });
}
