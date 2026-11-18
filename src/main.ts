import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { CodeReviewOrchestrator } from './orchestrator';
import { ReportGenerator } from './utils/report-generator';
import { logger, logReviewStart } from './utils/logger';
import { isReviewError, formatError } from './utils/error-handler';

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Claude Multi-Agent Code Review System
 * Usage: npm run dev <owner> <repo> <pr-number>
 */
async function main() {
  const [owner, repo, prStr] = process.argv.slice(2);

  // Validate command line arguments
  if (!owner || !repo || !prStr) {
    console.error('Usage: npm start <owner> <repo> <pr-number>');
    console.error('Example: npm start anthropics anthropic-sdk 1234');
    process.exit(1);
  }

  const prNumber = parseInt(prStr, 10);
  if (isNaN(prNumber) || prNumber <= 0) {
    console.error('Error: PR number must be a positive integer');
    process.exit(1);
  }

  // Validate authentication
  const hasAnthropicAuth = !!process.env.ANTHROPIC_API_KEY;
  const hasBedrockAuth = !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY;

  if (!hasAnthropicAuth && !hasBedrockAuth) {
    console.error('Error: No authentication method configured');
    console.error('Please provide ONE of:');
    console.error('  1. ANTHROPIC_API_KEY environment variable (Anthropic API)');
    console.error('  2. AWS_ACCESS_KEY_ID + AWS_SECRET_ACCESS_KEY (AWS Bedrock)');
    process.exit(1);
  }

  if (hasBedrockAuth && !process.env.AWS_REGION) {
    console.error('Error: AWS_REGION must be set when using AWS Bedrock');
    process.exit(1);
  }

  // Validate ANTHROPIC_MODEL
  if (!process.env.ANTHROPIC_MODEL) {
    console.error('Error: ANTHROPIC_MODEL environment variable is required');
    console.error('Examples:');
    console.error('  - For Anthropic API: claude-sonnet-4-5-20250929');
    console.error('  - For AWS Bedrock: us.anthropic.claude-sonnet-4-5-20250929-v1:0');
    process.exit(1);
  }

  // Log authentication method
  if (hasBedrockAuth) {
    console.log('🔐 Using AWS Bedrock authentication');
  } else {
    console.log('🔐 Using Anthropic API authentication');
  }

  try {
    console.log(`\n🚀 Starting code review for ${owner}/${repo}#${prNumber}\n`);

    // Create orchestrator instance
    const orchestrator = new CodeReviewOrchestrator({
      timeoutMs: 300000, // 5 minutes
      maxRetries: 3
    });

    // Run the review
    const report = await orchestrator.reviewPullRequest(owner, repo, prNumber);

    // Generate reports
    const generator = new ReportGenerator();
    const markdownReport = generator.generateMarkdownReport(report);
    const htmlReport = generator.generateHTMLReport(report);
    const jsonReport = generator.generateJSONReport(report);

    // Create reports directory if it doesn't exist
    const reportsDir = 'reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    // Save reports with PR-specific filenames
    const timestamp = new Date().toISOString().split('T')[0];
    const basename = `${owner}-${repo}-${prNumber}-${timestamp}`;

    const markdownPath = path.join(reportsDir, `${basename}.md`);
    const htmlPath = path.join(reportsDir, `${basename}.html`);
    const jsonPath = path.join(reportsDir, `${basename}.json`);

    fs.writeFileSync(markdownPath, markdownReport, 'utf-8');
    fs.writeFileSync(htmlPath, htmlReport, 'utf-8');
    fs.writeFileSync(jsonPath, jsonReport, 'utf-8');

    console.log(`\n✅ Code review completed successfully!\n`);
    console.log(`Reports saved:`);
    console.log(`  📝 Markdown: ${markdownPath}`);
    console.log(`  🌐 HTML: ${htmlPath}`);
    console.log(`  📊 JSON: ${jsonPath}\n`);

    console.log(`Overall Score: ${report.summary.overallScore}/100`);
    console.log(`Files Reviewed: ${report.summary.totalFiles}`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`Test Gaps: ${report.summary.highPriorityTests}`);
    console.log(`Refactoring Opportunities: ${report.summary.refactoringOpportunities}\n`);

    process.exit(0);
  } catch (error) {
    if (isReviewError(error)) {
      console.error(`\n❌ Code review failed: [${error.code}] ${error.message}`);
      if (error.metadata) {
        console.error('Details:', error.metadata);
      }
    } else {
      console.error(`\n❌ Code review failed: ${formatError(error)}`);
    }

    logger.error('Code review failed', {
      owner,
      repo,
      prNumber,
      error: error instanceof Error ? error.message : String(error)
    });

    process.exit(1);
  }
}

main();
