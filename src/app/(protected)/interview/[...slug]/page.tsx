import { UserInterview, Interview } from "@/app/types";
import {
  getInterviewData,
  getInterviewQuestions,
  getUserInterviewData,
} from "@/lib/supabase/serverside_fetchers";
import InterviewView from "@/views/InterviewView";

const InterviewPage = async ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) => {
  const userInterviewId = searchParams.id ? parseInt(searchParams.id, 10) : 0;
  const user_interview: UserInterview | null = await getUserInterviewData(
    userInterviewId
  );

  let interview: Interview | null = null;
  if (user_interview && user_interview.interview_id) {
    interview = await getInterviewData(user_interview.interview_id);
  }

  const companies = interview?.tags;

  const data = await getInterviewQuestions(
    userInterviewId,
    companies || "",
    interview?.no_of_questions || 0
  );

  if (!data) {
    return;
  }

  return (
    <InterviewView
      user_interview={user_interview}
      interview={interview}
      questions={data?.questions}
      interview_questions={data?.interview_questions}
    />
  );
};

export default InterviewPage;
