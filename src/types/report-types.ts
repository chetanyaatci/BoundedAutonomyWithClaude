import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import {
  CodeQualityResultSchema,
  TestCoverageResultSchema,
  RefactoringSuggestionSchema
} from './analysis-results';

/**
 * Complete Review Report Schema
 * Aggregates all subagent results into a unified report
 */
export const ReviewReportSchema = z.object({
  pullRequest: z.object({
    owner: z.string().describe('GitHub repository owner'),
    repo: z.string().describe('GitHub repository name'),
    number: z.number().describe('Pull request number')
  }).describe('Pull request information'),
  fileReviews: z.array(z.object({
    file: z.string().describe('Path to the file reviewed'),
    codeQuality: CodeQualityResultSchema.describe('Code quality analysis'),
    testCoverage: TestCoverageResultSchema.describe('Test coverage analysis'),
    refactorings: RefactoringSuggestionSchema.describe('Refactoring suggestions')
  }).describe('Analysis results for a single file')).describe('Per-file analysis results'),
  summary: z.object({
    totalFiles: z.number().describe('Total number of files reviewed'),
    overallScore: z.number().min(0).max(100).describe('Overall code quality score from 0-100'),
    criticalIssues: z.number().describe('Total number of critical issues found'),
    highPriorityTests: z.number().describe('Total number of high-priority test gaps'),
    refactoringOpportunities: z.number().describe('Total number of refactoring opportunities')
  }),
  recommendations: z.array(z.object({
    priority: z.enum(['critical', 'high', 'medium', 'low']).describe('Priority level of the recommendation'),
    category: z.string().describe('Category of the recommendation'),
    description: z.string().describe('Description of the recommendation'),
    files: z.array(z.string()).describe('Files affected by this recommendation')
  }).describe('A single recommendation')).describe('List of prioritized recommendations'),
  metadata: z.object({
    analyzedAt: z.string().describe('ISO timestamp of when the review was performed'),
    duration: z.number().describe('Duration of the review in milliseconds'),
    agentVersions: z.record(z.string()).describe('Versions of each agent used')
  }).describe('Metadata about the analysis')
});

/**
 * TypeScript type inferred from Zod schema
 */
export type ReviewReport = z.infer<typeof ReviewReportSchema>;

type JsonSchema = Record<string, unknown>;
const toJsonSchema = (schema: z.ZodTypeAny): JsonSchema =>
  (zodToJsonSchema as (s: unknown, options?: unknown) => unknown)(
    schema,
    { $refStrategy: 'root' }
  ) as JsonSchema;

/**
 * JSON Schema for SDK structured outputs
 * Per SDK docs: https://platform.claude.com/docs/en/agent-sdk/structured-outputs
 * Use $refStrategy: 'root' to properly inline all $ref definitions
 */
const rawSchema: JsonSchema = toJsonSchema(ReviewReportSchema);

// Extract the actual schema - zodToJsonSchema may wrap it with extra properties
export const ReviewReportJSONSchema = rawSchema;
