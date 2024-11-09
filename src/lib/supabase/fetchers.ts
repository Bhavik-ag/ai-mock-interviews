import supabaseBrowserClient from "@/lib/supabase/client";
import { FormData } from "@/views/OnboardingView/types";
import extractTextFromPDF from "pdf-parser-client-side";

export const generateResumeSummary = async (resume: File) => {
  try {
    const text = await extractTextFromPDF(
      resume,
      "alphanumericwithspaceandpunctuationandnewline",
    );
    return {
      status: true,
      summary: text || "",
    };
  } catch (error) {
    return {
      status: false,
      summary: "",
    };
  }
};

export const uploadUserFile = async (file: File) => {
  const user = await supabaseBrowserClient.auth.getUser();
  const userId = user.data.user?.id;
  const { data, error } = await supabaseBrowserClient.storage
    .from("user_files")
    .upload(`${userId}/${file.name}`, file);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

export const getUserFileSignedUrl = async (filePath: string) => {
  const { data, error } = await supabaseBrowserClient.storage
    .from("user_files")
    .createSignedUrl(filePath, 600);
  if (error) {
    throw error;
  }
  return data;
};

export const createUserOnboardingDetails = async (data: FormData) => {
  const { resume, ...dataWithoutResume } = data;
  const { error } = await supabaseBrowserClient
    .from("user_details")
    .insert([dataWithoutResume]);
  if (error) {
    throw error;
  }
  return { success: true };
};

export const updateConversation = async (
  conversation: JSON[],
  interviewId: string,
) => {
  const { error } = await supabaseBrowserClient
    .from("user_interviews")
    .update({ conversation: conversation })
    .eq("id", interviewId);
  if (error) {
    throw error;
  }
  return { success: true };
};
