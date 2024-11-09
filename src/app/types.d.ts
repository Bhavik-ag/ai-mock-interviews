import { Database } from "./database.types";

export type User = any;

export type Interview = Database["public"]["Tables"]["interviews"]["Row"];
export type UserInterview =
  Database["public"]["Tables"]["user_interviews"]["Row"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type FollowupQuestion = Database["public"]["Tables"]["followups"]["Row"];
export type InterviewQuestion =
  Database["public"]["Tables"]["interview_questions"]["Row"];
export type InterviewDetail =
  Database["public"]["Views"]["interview_details"]["Row"];
