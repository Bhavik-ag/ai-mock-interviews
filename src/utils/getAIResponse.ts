export const getAIResponse = async (question: string, raw_answer: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      question: question,
      raw_answer: raw_answer,
      type: "ai_response",
    }),
  });

  const data = await response.json();

  return data.result;
};
