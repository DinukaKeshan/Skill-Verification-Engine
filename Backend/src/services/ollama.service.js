const OLLAMA_URL = "http://localhost:11434/api/generate";

function repairJson(raw) {
  return raw
    // Replace smart quotes if any
    .replace(/[“”]/g, '"')
    // Replace single-quoted keys
    .replace(/'([^']+)'(?=\s*:)/g, '"$1"')
    // Replace single-quoted values
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    // Replace single-quoted array strings
    .replace(/'([^']*)'/g, '"$1"');
}

export const generateQuestion = async (skill) => {
  const prompt = `
Generate ONE multiple-choice question for ${skill}.

STRICT RULES:
- Respond with ONLY a JSON object
- No explanation
- No markdown
- No text outside JSON

JSON FORMAT:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": number
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
  const rawText = data.response;

  console.log("RAW OLLAMA OUTPUT:", rawText);

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON object found in Ollama output");
  }

  try {
    const repaired = repairJson(jsonMatch[0]);
    return JSON.parse(repaired);
  } catch (err) {
    console.error("❌ JSON PARSE FAILED");
    console.error("RAW:", rawText);
    throw new Error("Invalid JSON from Ollama");
  }
};
