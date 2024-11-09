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

export default async function DSAFollowup(question: string, code: string) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction:
      "You are an interviewer for a data structures and algorithms interview round. Based on the question and the code written by the user at a certain time, you need to generate a followup question. Only ask the question, do not give any suggestion. The output should only contain the response text of the question.",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: "Okay, let's start with the question.",
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: `Here is the question text: \n ${question}`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(code);
  return result.response.text();
}
