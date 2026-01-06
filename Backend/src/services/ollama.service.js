const OLLAMA_URL = "http://localhost:11434/api/generate";

/**
 * Repairs malformed JSON from LLM output
 */
function repairJson(raw) {
  return raw
    // smart quotes
    .replace(/[“”]/g, '"')
    // single-quoted keys
    .replace(/'([^']+)'(?=\s*:)/g, '"$1"')
    // single-quoted values
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    // single-quoted array values
    .replace(/'([^']*)'/g, '"$1"')
    // trailing commas
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");
}

/**
 * Generates JSON output from Ollama using a supplied prompt
 */
export async function generateFromOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama3",
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.response;

  console.log("🦙 RAW OLLAMA OUTPUT:\n", rawText);

  // Extract JSON safely
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
}

/**
 * (Optional) Backward compatibility
 * Allows old calls: generateQuestion(skill)
 */
export async function generateQuestion(skill) {
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

  return generateFromOllama(prompt);
}
