import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function SignOut() {
  const { error } = await createSupabaseServerClient().auth.signOut();
  if (error) console.log(error);
  else redirect("/auth/login");
}
