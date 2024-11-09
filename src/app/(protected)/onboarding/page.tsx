import { createSupabaseServerClient } from "@/lib/supabase/server";
import OnboardingView from "@/views/OnboardingView";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams?: { from: "email" | "google" | undefined };
}) {
  const user = await createSupabaseServerClient().auth.getUser();
  const isOnboardingComplete = user?.data.user?.user_metadata?.isOnboarding;
  if (isOnboardingComplete) {
    return redirect("/");
  }
  return <OnboardingView from={searchParams?.from} user={user} />;
}
