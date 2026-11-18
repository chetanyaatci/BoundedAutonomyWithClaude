/**
 * Agent definitions for the multi-agent code review system
 *
 * Each agent is defined in its own file for maintainability and clarity.
 * Agents are configured with:
 * - Specific prompts tailored to their analysis domain
 * - Appropriate tools (github, eslint, skill)
 * - Model selection based on complexity (haiku for speed, sonnet for depth)
 * - Structured output formats using Zod schemas
 */

export { codeQualityAnalyzer } from './code-quality-analyzer';
export { testCoverageAnalyzer } from './test-coverage-analyzer';
export { refactoringSuggester } from './refactoring-suggester';

import { codeQualityAnalyzer } from './code-quality-analyzer';
import { testCoverageAnalyzer } from './test-coverage-analyzer';
import { refactoringSuggester } from './refactoring-suggester';

/**
 * Agents map for easy access by name
 */
export const agents = {
  codeQualityAnalyzer,
  testCoverageAnalyzer,
  refactoringSuggester
};
