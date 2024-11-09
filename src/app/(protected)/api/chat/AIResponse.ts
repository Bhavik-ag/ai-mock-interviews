const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function AIResponse(question: string, raw_answer: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are an interviewer for a technical round at an IT company. Based on the question and  the candidate's response, generate reply as an interviewer in not more than 25 words. If it is an introduction of the candidate, compliment and end with - let's move to the questions. The output should only contain the response text as an interviewer.",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Hello, good morning !",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: question,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(raw_answer);
  return result.response.text();
}
