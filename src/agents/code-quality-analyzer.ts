import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { CODE_QUALITY_ANALYZER_PROMPT } from '../prompts/code-quality-analyzer.prompt';
import { CodeQualityResultJSONSchema } from '../types';

/**
 * Code Quality Analyzer Agent
 *
 * Identifies code smells, anti-patterns, security issues, and performance problems.
 * Uses the javascript-best-practices skill from .claude/skills/ to enforce coding standards.
 *
 * Configuration:
 * - model: 'haiku' - Fast and cost-effective for code analysis
 * - tools: ['github', 'eslint', 'skill'] - Access to GitHub MCP, ESLint MCP, and Claude Skills
 * - outputFormat: Structured JSON matching CodeQualityResultSchema
 */
export const codeQualityAnalyzer: AgentDefinition = {
  description: 'Analyzes code for quality issues including security vulnerabilities, performance problems, maintainability concerns, and best practice violations. Leverages Claude Skills for language-specific coding standards.',
  prompt: CODE_QUALITY_ANALYZER_PROMPT,
  tools: ['github', 'eslint', 'skill'],
  model: 'haiku'
};
