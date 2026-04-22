import React from 'react';
import type { DebugResponse } from '../types/index';
import '../styles/DebugPanel.css';

interface DebugPanelProps {
  debugResult: DebugResponse | null;
  loading: boolean;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ debugResult, loading }) => {
  if (loading) {
    return <div className="debug-panel">Analyzing your code...</div>;
  }

  if (!debugResult) {
    return <div className="debug-panel empty">Run debug mode to analyze your code</div>;
  }

  return (
    <div className="debug-panel">
      <div className="debug-header">
        <h3>{debugResult.issueFound ? '🔴 Issues Found' : '✅ No Issues Detected'}</h3>
      </div>

      {debugResult.issues.length > 0 && (
        <div className="debug-issues">
          {debugResult.issues.map((issue, i) => (
            <div key={i} className="issue-card">
              <div className="issue-summary">{issue.summary}</div>
              <div className="issue-location">
                <strong>Location:</strong> {issue.location}
              </div>
              <div className="issue-explanation">
                <strong>What's wrong:</strong> {issue.logicExplanation}
              </div>
              <div className="issue-failing-input">
                <strong>Failing Input:</strong>
                <code>{issue.exampleFailingInput}</code>
              </div>
              <div className="issue-walkthrough">
                <strong>Why it fails:</strong>
                <ol>
                  {issue.stepByStepFailure.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="debug-analysis">
        <strong>Overall Analysis:</strong>
        <p>{debugResult.overallAnalysis}</p>
      </div>
    </div>
  );
};
