import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Structured output schemas for subagent analysis results
 * Uses Zod for runtime validation and converts to JSON Schema for SDK
 */

// Code Quality Analyzer output schema
export const CodeQualityResultSchema = z.object({
  file: z.string().describe('Path to the analyzed file'),
  issues: z.array(z.object({
    line: z.number().describe('Line number where the issue is located'),
    severity: z.enum(['critical', 'high', 'medium', 'low', 'info']).describe('Severity level of the issue (critical = must fix, high = important, medium = should consider, low = nice to have, info = informational)'),
    category: z.enum([
      'security',
      'performance',
      'maintainability',
      'style',
      'bug-risk',
      'best-practice'
    ]).describe('Category of the code quality issue'),
    description: z.string().describe('Detailed description of the issue'),
    suggestion: z.string().describe('Specific suggestion for fixing the issue')
  })).describe('Array of identified code quality issues'),
  overallScore: z.number().min(0).max(100).describe('Overall code quality score from 0-100 (100 = excellent, 0 = poor)'),
  summary: z.string().describe('Brief summary of the code quality analysis')
});

// Test Coverage Analyzer output schema
export const TestCoverageResultSchema = z.object({
  file: z.string().describe('Path to the analyzed file'),
  hasTests: z.boolean().describe('Whether the file has associated test files'),
  testFiles: z.array(z.string()).describe('List of test files covering this file'),
  untestedPaths: z.array(z.object({
    type: z.enum(['function', 'class', 'branch', 'edge-case']).describe('Type of untested code element'),
    location: z.string().describe('Location in the file where the gap exists'),
    priority: z.enum(['critical', 'high', 'medium', 'low']).describe('Priority level for adding tests'),
    reasoning: z.string().describe('Explanation of why this needs testing'),
    suggestedTest: z.string().describe('Suggested test case or approach')
  })).describe('Array of identified test coverage gaps'),
  coverageEstimate: z.number().min(0).max(100).describe('Estimated test coverage percentage from 0-100'),
  summary: z.string().describe('Brief summary of test coverage analysis')
});

// Refactoring Suggester output schema
export const RefactoringSuggestionSchema = z.object({
  file: z.string().describe('Path to the analyzed file'),
  suggestions: z.array(z.object({
    type: z.enum([
      'extract-function',
      'rename',
      'modernize',
      'simplify',
      'pattern-improvement'
    ]).describe('Type of refactoring suggestion'),
    location: z.string().describe('Location in the file where refactoring is suggested'),
    impact: z.enum(['low', 'medium', 'high']).describe('Expected positive impact of the refactoring (low = minor improvement, high = significant improvement)'),
    description: z.string().describe('Explanation of why this refactoring is recommended'),
    before: z.string().describe('Code snippet showing the current implementation'),
    after: z.string().describe('Code snippet showing the refactored implementation'),
    benefits: z.string().describe('List of benefits from applying this refactoring')
  })).describe('Array of refactoring suggestions'),
  summary: z.string().describe('Brief summary of refactoring opportunities identified')
});

// TypeScript type exports
export type CodeQualityResult = z.infer<typeof CodeQualityResultSchema>;
export type TestCoverageResult = z.infer<typeof TestCoverageResultSchema>;
export type RefactoringSuggestion = z.infer<typeof RefactoringSuggestionSchema>;

type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  (zodToJsonSchema as (s: unknown, options?: unknown) => unknown)(
    schema,
    { $refStrategy: 'root' }
  ) as JsonSchema;

/**
 * Convert Zod schemas to JSON Schema for SDK structured outputs
 * Per SDK docs: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
 * Use $refStrategy: 'root' to properly inline all $ref definitions
 */
export const CodeQualityResultJSONSchema: JsonSchema = toJsonSchema(CodeQualityResultSchema);
export const TestCoverageResultJSONSchema: JsonSchema = toJsonSchema(TestCoverageResultSchema);
export const RefactoringSuggestionJSONSchema: JsonSchema = toJsonSchema(RefactoringSuggestionSchema);
