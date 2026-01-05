const OLLAMA_URL = "http://localhost:11434/api/generate";

export const generateQuestion = async (skill) => {
  const prompt = `
Generate ONE multiple-choice quiz question for ${skill}.

RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- No text before or after JSON

JSON FORMAT:
{
  "question": "string",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0
}
`;

  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false
    })
  });

  const data = await response.json();

  // 🔥 IMPORTANT: Extract JSON from text
  const rawText = data.response;

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON found in Ollama response");
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("RAW OLLAMA OUTPUT:", rawText);
    throw new Error("Invalid JSON from Ollama");
  }
};
