export function buildQuestionPrompt(skill, context) {
  return `
You are a strict technical examiner.

Use ONLY the information provided below.
If the answer is not present, DO NOT guess.

CONTEXT:
${context}

TASK:
Generate ONE multiple-choice question for ${skill}.

RULES:
- Exactly 4 options
- One correct answer
- Fact must come from CONTEXT
- Respond ONLY with valid JSON
- No explanation
- No markdown

FORMAT:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": number
}
`;
}
