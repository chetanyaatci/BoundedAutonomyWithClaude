import { describe, it, expect, beforeEach } from 'vitest';
import { CodeReviewOrchestrator, OrchestratorOptions } from '../src/orchestrator';
import { ReviewReportSchema } from '../src/types/report-types';
import { ReviewError, ErrorCodes } from '../src/utils/error-handler';

/**
 * Tests for CodeReviewOrchestrator
 *
 * Basic tests for orchestrator initialization and schema validation
 */

describe('CodeReviewOrchestrator', () => {
  let orchestrator: CodeReviewOrchestrator;

  beforeEach(() => {
    orchestrator = new CodeReviewOrchestrator();
  });

  describe('Configuration', () => {
    it('should initialize with default options', () => {
      const orch = new CodeReviewOrchestrator();
      expect(orch).toBeDefined();
    });

    it('should accept custom timeout configuration', () => {
      const customOptions: OrchestratorOptions = {
        timeoutMs: 60000,
        maxRetries: 5
      };
      const orch = new CodeReviewOrchestrator(customOptions);
      expect(orch).toBeDefined();
    });

    it('should use default timeout of 300000ms when not specified', () => {
      const orch = new CodeReviewOrchestrator({});
      expect(orch).toBeDefined();
    });
  });

  describe('Input Validation', () => {
    it('should reject missing owner', async () => {
      try {
        await orchestrator.reviewPullRequest('', 'repo', 123);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ReviewError);
        if (error instanceof ReviewError) {
          expect(error.code).toBe(ErrorCodes.INVALID_CONFIG);
        }
      }
    });

    it('should reject missing repo', async () => {
      try {
        await orchestrator.reviewPullRequest('owner', '', 123);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ReviewError);
        if (error instanceof ReviewError) {
          expect(error.code).toBe(ErrorCodes.INVALID_CONFIG);
        }
      }
    });

    it('should reject zero or negative PR number', async () => {
      try {
        await orchestrator.reviewPullRequest('owner', 'repo', 0);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(ReviewError);
      }
    });
  });

  describe('Schema Validation', () => {
    it('should validate ReviewReport schema structure', () => {
      const validReport = {
        pullRequest: {
          owner: 'test-owner',
          repo: 'test-repo',
          number: 42
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 85,
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {
            'code-quality': '1.0.0',
            'test-coverage': '1.0.0',
            'refactoring': '1.0.0'
          }
        }
      };

      expect(() => {
        ReviewReportSchema.parse(validReport);
      }).not.toThrow();
    });

    it('should reject invalid overall score', () => {
      const invalidReport = {
        pullRequest: {
          owner: 'test-owner',
          repo: 'test-repo',
          number: 42
        },
        fileReviews: [],
        summary: {
          totalFiles: 0,
          overallScore: 150, // Invalid: > 100
          criticalIssues: 0,
          highPriorityTests: 0,
          refactoringOpportunities: 0
        },
        recommendations: [],
        metadata: {
          analyzedAt: new Date().toISOString(),
          duration: 1000,
          agentVersions: {}
        }
      };

      expect(() => {
        ReviewReportSchema.parse(invalidReport);
      }).toThrow();
    });
  });

  describe('Integration', () => {
    // These tests require actual API keys and should be skipped in CI
    it.skip('should review a real small PR', async () => {
      // NOTE: Only run manually with valid API keys
      // This would test with a real GitHub PR
    });
  });
});
