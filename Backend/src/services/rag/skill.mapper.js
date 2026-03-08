const SKILL_MAP = {
  "javascript": "javascript",
  "java script": "javascript",
  "js": "javascript",

  "react": "react",
  "reactjs": "react",

  "node": "node",
  "nodejs": "node"
};

export function mapSkillToFolder(skill) {
  return SKILL_MAP[skill.toLowerCase().trim()];
}
