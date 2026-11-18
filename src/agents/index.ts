import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import {
  CODE_QUALITY_ANALYZER_PROMPT,
  TEST_COVERAGE_ANALYZER_PROMPT,
  REFACTORING_SUGGESTER_PROMPT
} from '../prompts';
import {
  CodeQualityResultJSONSchema,
  TestCoverageResultJSONSchema,
  RefactoringSuggestionJSONSchema
} from '../types';

/**
 * Code Quality Analyzer Agent
 * Identifies code smells, anti-patterns, security issues, and performance problems
 */
export const codeQualityAnalyzer: AgentDefinition = {
  description: 'Analyzes code for quality issues including security vulnerabilities, performance problems, maintainability concerns, and best practice violations',
  prompt: CODE_QUALITY_ANALYZER_PROMPT,
  tools: ['github', 'eslint'],
  model: 'haiku'
};

/**
 * Test Coverage Analyzer Agent
 * Evaluates test completeness and suggests missing test cases
 */
export const testCoverageAnalyzer: AgentDefinition = {
  description: 'Analyzes test coverage for code files, identifies untested functions and edge cases, and suggests missing test cases',
  tools: ['github'],
  prompt: TEST_COVERAGE_ANALYZER_PROMPT,
  model: 'haiku'
};

/**
 * Refactoring Suggester Agent
 * Recommends architectural improvements and refactoring opportunities
 */
export const refactoringSuggester: AgentDefinition = {
  description: 'Recommends architectural improvements, refactoring opportunities, and modernization suggestions for code',
  tools: ['github'],
  prompt: REFACTORING_SUGGESTER_PROMPT,
  model: 'sonnet'
};

/**
 * Agents map for easy access by name
 */
export const agents = {
  codeQualityAnalyzer,
  testCoverageAnalyzer,
  refactoringSuggester
};
