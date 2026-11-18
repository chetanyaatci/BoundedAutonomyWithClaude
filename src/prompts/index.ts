/**
 * Centralized prompt exports for multi-agent code review system
 *
 * Each prompt is defined in its own file for maintainability.
 * Prompts are carefully crafted to:
 * - Guide agents on their specific analysis focus
 * - Reference Claude Skills for language-specific guidance
 * - Specify expected output structure (Zod schemas)
 * - Provide clear instructions on tool usage
 */

export { CODE_QUALITY_ANALYZER_PROMPT } from './code-quality-analyzer.prompt';
export { TEST_COVERAGE_ANALYZER_PROMPT } from './test-coverage-analyzer.prompt';
export { REFACTORING_SUGGESTER_PROMPT } from './refactoring-suggester.prompt';
export { ORCHESTRATOR_PROMPT } from './orchestrator.prompt';
