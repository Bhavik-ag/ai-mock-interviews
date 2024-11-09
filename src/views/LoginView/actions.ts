"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function emailLogin(data: { email: string; password: string }) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    const err = error.message;
    throw new Error(err);
  } else {
    redirect("/onboarding?from=email");
  }
}

export async function googleLogin() {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google_callback`,
    },
  });

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
