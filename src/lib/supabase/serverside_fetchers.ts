import {
  Interview,
  InterviewQuestion,
  Question,
  UserInterview,
} from "@/app/types";
import { createSupabaseServerClient } from "./server";

export const getUserInterviewData = async (
  userInterviewId: number
): Promise<UserInterview | null> => {
  const supabase = createSupabaseServerClient();
  const { data: user_interview, error: userInterviewError } = await supabase
    .from("user_interviews")
    .select("*")
    .eq("id", userInterviewId)
    .single();

  if (userInterviewError) {
    console.error("Error fetching user interview:", userInterviewError);
    return null;
  }

  return user_interview;
};

export const getInterviewData = async (
  interviewId: number
): Promise<Interview | null> => {
  const supabase = createSupabaseServerClient();
  const { data: interview, error: interviewError } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", interviewId)
    .single();

  if (interviewError) {
    console.error("Error fetching interview:", interviewError);
    return null;
  }
  return interview;
};

export const getInterviewQuestions = async (
  user_interview_id: number,
  companies: string,
  no_of_questions: number
): Promise<{
  questions: Question[] | null;
  interview_questions: InterviewQuestion[] | null;
} | null> => {
  const supabase = createSupabaseServerClient();

  // Check if there already exists interview_questions for this user_interview_id
  const {
    data: existingInterviewQuestions,
    error: existingInterviewQuestionsError,
  } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("user_interview_id", user_interview_id);

  // If there are existing questions, return them
  if (existingInterviewQuestions && existingInterviewQuestions.length) {
    const questionIds = existingInterviewQuestions.map(
      (question) => question.question_id
    );

    const { data: technicalQuestions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .in("id", questionIds);

    if (questionsError) {
      console.error("Error fetching questions:", questionsError);
      return null;
    }

    // Get the question with type "intro" on zeroth index of the list
    const questions = technicalQuestions.sort((a, b) => {
      if (a.type === "intro") return -1;
      if (b.type === "intro") return 1;
      return 0;
    });

    return { questions, interview_questions: existingInterviewQuestions };
  }

  // If new interview

  const { data: introQuestion, error: introQuestionError } = await supabase
    .from("questions")
    .select("*")
    .eq("type", "intro")
    .limit(1)
    .single();

  if (introQuestionError) {
    console.error("Error fetching intro question:", introQuestionError);
    return null;
  }

  const tags = companies?.split(",") || [];

  const orQueryString = tags
    .map((tag) => `companies.ilike.%${tag.trim()}%`)
    .join(", ");

  // Fetch questions based on tags
  let { data: technicalQuestions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .or(orQueryString)
    .limit(no_of_questions - 2);

  if (questionsError || !technicalQuestions) {
    console.error("Error fetching questions:", questionsError);
    return null;
  }

  const questions = [introQuestion, ...technicalQuestions];

  const questionData =
    questions?.map((question) => {
      return {
        question_id: question.id,
        user_interview_id,
      };
    }) || [];

  const { data: interview_questions, error: InterviewQuestionError } =
    await supabase.from("interview_questions").insert(questionData).select("*");

  if (InterviewQuestionError) {
    console.error(
      "Error inserting interview questions:",
      InterviewQuestionError
    );
    return null;
  }

  return { questions, interview_questions };
};

export const getInterviews = async () => {
  const supabase = createSupabaseServerClient();

  let { data: interviews, error } = await supabase
    .from("interviews")
    .select("*");

  console.log(error);

  return interviews;
};

export const getInterviewDetails = async (userId: string | undefined) => {
  if (!userId) {
    return null;
  }
  const supabase = createSupabaseServerClient();

  let { data: interviewDetails, error } = await supabase
    .from("interview_details")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching interview details:", error);
    return null;
  }

  return interviewDetails;
};

export const getInterviewsSnap = async (userId: string) => {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("interview_snap")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error("Error fetching interview snap:", error);
    return null;
  }

  return data;
};
