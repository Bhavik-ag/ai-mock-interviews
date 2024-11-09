export const getDSAFollowup = async (question: string, code: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      question: question,
      code: code,
      type: "dsa_followup",
    }),
  });

  const data = await response.json();

  return data.result;
};
