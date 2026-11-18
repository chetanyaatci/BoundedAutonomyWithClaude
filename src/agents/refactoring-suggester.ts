import type { AgentDefinition } from '@anthropic-ai/claude-agent-sdk';
import { REFACTORING_SUGGESTER_PROMPT } from '../prompts/refactoring-suggester.prompt';
import { RefactoringSuggestionJSONSchema } from '../types';

/**
 * Refactoring Suggester Agent
 *
 * Recommends architectural improvements and refactoring opportunities.
 * Suggests modernization, design pattern improvements, and code simplification.
 *
 * Configuration:
 * - model: 'sonnet' - More capable model for complex architectural analysis
 * - tools: ['github', 'skill'] - Access to GitHub MCP and Claude Skills
 * - outputFormat: Structured JSON matching RefactoringSuggestionSchema
 */
export const refactoringSuggester: AgentDefinition = {
  description: 'Recommends architectural improvements, refactoring opportunities, and modernization suggestions for code. Leverages Claude Skills for language-specific patterns and best practices.',
  prompt: REFACTORING_SUGGESTER_PROMPT,
  tools: ['github', 'skill'],
  model: 'sonnet'
};
