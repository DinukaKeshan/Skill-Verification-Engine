import { retrieveContext } from "./retriever.js";
import { buildQuestionPrompt } from "./prompt.builder.js";
import { generateFromOllama } from "../ollama.service.js";
import { mapSkillToFolder } from "./skill.mapper.js";

export async function generateRagQuestion(skill) {
  const folder = mapSkillToFolder(skill);

  if (!folder) {
    throw new Error(`Unsupported skill: ${skill}`);
  }

  const context = retrieveContext(folder);

  if (!context || context.trim().length === 0) {
    throw new Error(`No knowledge base found for skill: ${skill}`);
  }

  const prompt = buildQuestionPrompt(skill, context);
  return generateFromOllama(prompt);
}
