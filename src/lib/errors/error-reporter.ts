import { ErrorInfo } from 'react';

export interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  url: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
}

export interface ErrorReporterConfig {
  enabled: boolean;
  endpoint?: string;
  maxReports?: number;
  throttleMs?: number;
}

class ErrorReporter {
  private config: ErrorReporterConfig;
  private reportCount = 0;
  private lastReportTime = 0;

  constructor(config: ErrorReporterConfig) {
    this.config = {
      maxReports: 100,
      throttleMs: 60000, // 1 minute
      ...config,
    };
  }

  logError(error: Error, errorInfo?: ErrorInfo, metadata?: Record<string, unknown>) {
    if (!this.config.enabled) {
      console.error('Error logged:', error, errorInfo, metadata);
      return;
    }

    // Check rate limits
    const now = Date.now();
    if (
      this.reportCount >= (this.config.maxReports ?? 100) ||
      now - this.lastReportTime < (this.config.throttleMs ?? 60000)
    ) {
      console.warn('Error reporting rate limit exceeded');
      return;
    }

    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack || undefined,
      timestamp: now,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metadata,
    };

    this.sendReport(report);
    this.reportCount++;
    this.lastReportTime = now;
  }

  private async sendReport(report: ErrorReport) {
    if (!this.config.endpoint) {
      // In production, you would send to a real error monitoring service
      console.error('Error report:', report);
      return;
    }

    try {
      await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report),
      });
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  resetLimits() {
    this.reportCount = 0;
    this.lastReportTime = 0;
  }
}

// Create singleton instance
export const errorReporter = new ErrorReporter({
  enabled: process.env.NODE_ENV === 'production',
  // endpoint: process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT,
});