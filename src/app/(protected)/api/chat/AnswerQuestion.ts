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

export default async function handleCandidateQuestion(
  question: string,
  code: string,
  candidateQuery: string
) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    You are an interviewer for a data structures and algorithms interview. Based on the following coding question and the candidate's query, respond appropriately:
    
    - Coding Question: ${question}
    - Candidate's Code: ${code}
    - Candidate's Question: ${candidateQuery}
    
    Respond appropriately based on the relevance of the candidate's question:
    
    - If the question is related to the coding task or their approach, provide a clear and concise explanation to assist them.
    - If the question is unrelated to the interview, politely redirect them back to the current problem.
    
    Your response should be professional and should only contain the interviewer's reply. Also do not use any special characters like ', \`, ", *, etc. as they may cause issues with the response in speech-to-text conversion. Do not include any new line characters.
    `,
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
            text: `Here is the question text:\n${question}`,
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(candidateQuery);
  return result.response.text();
}
