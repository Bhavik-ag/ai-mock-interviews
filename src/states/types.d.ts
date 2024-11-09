import type { Interview, UserInterview, Question } from "@/app/types";

export interface InterviewControlsState {
  isCamOn: boolean;
  isMicOn: boolean;
  isCaptionOn: boolean;
  settings: Record<string, unknown>;

  toggleCamera: () => void;
  toggleMicrophone: () => void;
  toggleCaptions: () => void;
  updateSetting: (key: string, value: unknown) => void;
}

export interface InterviewState {
  interview_state: {
    user_interview: UserInterview | null;
    interview: Interview | null;
    questions: Question[] | null1;
    interview_questions: InterviewQuestion[] | null;
  };

  updateInterviewState: (interview_state) => void;
}

export interface CurrentInterviewQuestionState {
  currentQuestion: Question | null;
  raw_answer: string;
  timeElapsed: number;
  followUpQuestion: FollowupQuestion[] | null;
  isCompleted: boolean;

  updateFollowUpQuestion: (question: FollowupQuestion) => void;
  updateIsCompleted: (isCompleted: boolean) => void;
  updateElapsedTime: (time: number) => void;
  updateRawAnswer: (answer: string) => void;
  updateCurrentQuestion: (question: Question) => void;
}
