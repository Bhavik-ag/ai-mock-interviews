"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { type Interview } from "@/app/types";

export async function schedule_user_interview(
  interviewId: Interview["id"],
  interviewSlug: Interview["slug"],
  date: Date | null
): Promise<string | null> {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("user_interviews")
      .insert([{ user_id: user?.id, interview_id: interviewId }])
      .select("*");

    if (!data) {
      console.error(error);
      return null;
    }
    const _ = await supabase
      .from("user_interviews")
      .update({ scheduled_time: date ? date.toISOString() : null })
      .eq("id", data[0].id)
      .select();

    return `/interview/${interviewSlug}/?id=${data[0].id}`;
  } catch (error) {
    console.error(error);
    return null;
  }
}
