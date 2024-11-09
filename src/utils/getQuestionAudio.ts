import supabaseBrowserClient from "@/lib/supabase/client";

export const getQuestionAudio = async (questionId: number) => {
  if (questionId === 0) {
    throw Error("Invalid question number");
  }

  const { data, error } = await supabaseBrowserClient.storage
    .from("questions")
    .createSignedUrl(`${questionId}.wav`, 600);
  if (error) {
    throw error;
  }
  return data;
};
