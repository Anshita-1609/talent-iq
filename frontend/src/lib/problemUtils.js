import { PROBLEMS } from "../data/problems";

/** Old sessions / typos → canonical problem title in problems.js */
const TITLE_ALIASES = {
  "Valid Parentheses": "Valid Palindrome",
  "Merge Two Sorted Lists": "Reverse String",
};

/** Match session problem title to PROBLEMS entry (aliases + case-insensitive). */
export function findProblemByTitle(title) {
  if (!title) return null;
  const canonical = TITLE_ALIASES[title] || title;
  const problems = Object.values(PROBLEMS);
  return (
    problems.find((p) => p.title === canonical) ||
    problems.find((p) => p.title.toLowerCase() === canonical.toLowerCase())
  );
}

export const DEFAULT_STARTER_CODE = {
  javascript: `// Write your solution here\n\n`,
  python: `# Write your solution here\n\n`,
  java: `public class Main {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}\n`,
};
