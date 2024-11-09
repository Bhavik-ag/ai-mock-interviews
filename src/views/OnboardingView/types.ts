import { z } from "zod";

export const formSchema = z.object({
  profession: z.enum(["student", "working_professional"], {
    required_error: "Profession is required",
  }),
  college: z.string().optional(),
  passing_year: z.string().optional(),
  company: z.string().optional(),
  job_title: z.string().optional(),
  years_of_experience: z.string().optional(),
  resume: z.any().nullable().optional(),
});

export type FormData = z.infer<typeof formSchema>;
