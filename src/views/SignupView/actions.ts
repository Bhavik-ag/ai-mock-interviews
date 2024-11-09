"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signup(data: {
  fname: string;
  lname: string;
  email: string;
  password: string;
}) {
  const userData = {
    email: data.email,
    password: data.password,
    options: {
      data: {
        first_name: data.fname,
        last_name: data.lname,
      },
    },
  };
  const { error } = await createSupabaseServerClient().auth.signUp(userData);

  if (error) {
    throw error;
  } else {
    return "SignUp Successful";
  }
}
