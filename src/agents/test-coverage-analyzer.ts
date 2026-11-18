import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { TEST_COVERAGE_ANALYZER_PROMPT } from '../prompts/test-coverage-analyzer.prompt';
import { TestCoverageResultJSONSchema } from '../types';

/**
 * Test Coverage Analyzer Agent
 *
 * Evaluates test completeness and suggests missing test cases.
 * Identifies untested functions, classes, branches, and edge cases.
 *
 * Configuration:
 * - model: 'haiku' - Fast analysis suitable for test coverage evaluation
 * - tools: ['github', 'skill'] - Access to GitHub MCP and Claude Skills
 * - outputFormat: Structured JSON matching TestCoverageResultSchema
 */
export const testCoverageAnalyzer: AgentDefinition = {
  description: 'Analyzes test coverage for code files, identifies untested functions and edge cases, and suggests missing test cases. Uses Claude Skills for test pattern recommendations.',
  prompt: TEST_COVERAGE_ANALYZER_PROMPT,
  tools: ['github', 'skill'],
  model: 'haiku'
};
