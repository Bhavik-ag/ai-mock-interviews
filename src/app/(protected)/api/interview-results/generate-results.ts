import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export default async function GenerateResults(chat: any) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
      You have given a conversation chat for an online tech interview. Analyze the given mock interview conversation and produce a JSON report in the exact format below. Include all the fields as shown in the example JSON.

      Example JSON:

      \`\`\`json
      {
        "interviewSummary": "A brief summary of the interview discussion and topics covered.",
        "candidateProfile": {
          "name": "Candidate's Name",
          "education": "Education background summary",
          "skillsMentioned": ["List", "of", "skills", "mentioned"]
        },
        "interactionMetrics": {
          "totalMessages": 0,
          "candidateMessages": 0,
          "interviewerMessages": 0,
          "averageResponseTime": 0,
          "questionCount": 0
        },
        "technicalResponsesAnalysis": [
          {
            "question": "Technical question asked by the interviewer.",
            "codeSubmitted": true,
            "logicExplanationQuality": "Clear",
            "responseCompleteness": "Complete",
            "keyConceptsUsed": ["List", "of", "key", "concepts"],
            "followUpQuestions": 0
          }
        ],
        "communicationSkills": {
          "clarity": "Clear",
          "confidence": "High",
          "conciseness": "Concise"
        },
        "overallPerformance": {
          "technicalScore": 0,
          "communicationScore": 0,
          "overallFeedback": "Brief feedback on strengths and areas for improvement."
        },
        "recommendation": {
          "proceedToNextRound": true,
          "suggestedFocusAreas": ["List", "of", "areas", "for", "improvement"]
        }
      }
      \`\`\`
    `,
  });

  const chatSession = await model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: chat }],
      },
    ],
  });

  const result = await chatSession.sendMessage(
    "Give me 'only' required json. No other instructions or text"
  );
  return result.response.text();
}
