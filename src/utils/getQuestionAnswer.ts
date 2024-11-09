export const getQuestionAnswer = async (
  question: string,
  code: string,
  candidateQuery: string
) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      question: question,
      code: code,
      type: "answer_question",
      candidateQuery: candidateQuery,
    }),
  });

  const data = await response.json();

  return data.result;
};
