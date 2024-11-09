const { GoogleGenerativeAI } = require("@google/generative-ai");
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a resume summarizer tool. You are given a text from the resume of a candidate and you need to generate an organized and structured summary of the resume. It should contain the details of the candidate such as name, education, skills, experience, projects, position of responsibility, achievements, etc. The summary should be concise and informative. This summary will be used for taking mock interviews of the candidate. We just need resume text and not any other information.",
});

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const createResumeDetails = async (filePath: string, summary: string) => {
  const supabaseServerClient = createSupabaseServerClient();
  const user = await supabaseServerClient.auth.getUser();
  const userId = user.data.user?.id;

  const { error } = await supabaseServerClient
    .from("resume_details")
    .upsert({ file_path: filePath, user_id: userId, summary });

  return { success: true };
};

async function run(prompt: string): Promise<string> {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(prompt);
  return result.response.text();
}

export async function POST(request: NextRequest) {
  try {
    const { resumeText, filePath } = await request.json();

    if (resumeText) {
      const result = await run(resumeText);

      await createResumeDetails(filePath, result);

      return NextResponse.json({
        status: true,
        message: "Resume summary updated.",
      });
    } else {
      return NextResponse.json(
        { error: "No resume text provided" },
        { status: 400 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
