import React from 'react';
import type { FeedbackResponse } from '../types/index';
import '../styles/FeedbackPanel.css';

interface FeedbackPanelProps {
  feedbackResult: FeedbackResponse | null;
  loading: boolean;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedbackResult, loading }) => {
  if (loading) {
    return <div className="feedback-panel">Evaluating your solution...</div>;
  }

  if (!feedbackResult) {
    return <div className="feedback-panel empty">Run feedback mode to evaluate your solution</div>;
  }

  return (
    <div className="feedback-panel">
      <div className="feedback-section">
        <h3>Correctness</h3>
        <div className={`status ${feedbackResult.correctness.status}`}>
          {feedbackResult.correctness.status === 'pass' ? '✅ Pass' : '❌ Issues'}
        </div>
        <p>{feedbackResult.correctness.details}</p>
      </div>

      <div className="feedback-section">
        <h3>Complexity Analysis</h3>
        <div className="complexity-grid">
          <div className="complexity-item">
            <strong>Time Complexity</strong>
            <div>Detected: <code>{feedbackResult.timeComplexity.detected}</code></div>
            <div>Expected: <code>{feedbackResult.timeComplexity.expected}</code></div>
            <div className={feedbackResult.timeComplexity.isOptimal ? 'optimal' : 'suboptimal'}>
              {feedbackResult.timeComplexity.isOptimal ? '✅ Optimal' : '⚠️ Suboptimal'}
            </div>
            <p>{feedbackResult.timeComplexity.explanation}</p>
          </div>

          <div className="complexity-item">
            <strong>Space Complexity</strong>
            <div>Detected: <code>{feedbackResult.spaceComplexity.detected}</code></div>
            <div>Expected: <code>{feedbackResult.spaceComplexity.expected}</code></div>
            <div className={feedbackResult.spaceComplexity.isOptimal ? 'optimal' : 'suboptimal'}>
              {feedbackResult.spaceComplexity.isOptimal ? '✅ Optimal' : '⚠️ Suboptimal'}
            </div>
            <p>{feedbackResult.spaceComplexity.explanation}</p>
          </div>
        </div>
      </div>

      {feedbackResult.optimizationSuggestions.length > 0 && (
        <div className="feedback-section">
          <h3>Optimization Suggestions</h3>
          <ul>
            {feedbackResult.optimizationSuggestions.map((suggestion, i) => (
              <li key={i}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {feedbackResult.codeQualityNotes.length > 0 && (
        <div className="feedback-section">
          <h3>Code Quality Notes</h3>
          <ul>
            {feedbackResult.codeQualityNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="feedback-section">
        <h3>Comparison to Optimal</h3>
        <p>{feedbackResult.comparison}</p>
      </div>
    </div>
  );
};
