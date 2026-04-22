import React from 'react';
import type { Problem } from '../types/index';
import '../styles/ProblemDescription.css';

interface ProblemDescriptionProps {
  problem: Problem | null;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  if (!problem) {
    return <div className="problem-description empty">Select a problem to get started</div>;
  }

  return (
    <div className="problem-description">
      <div className="description-header">
        <h1>{problem.title}</h1>
        <div className="meta-info">
          <span className={`difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
        </div>
      </div>

      <div className="description-content">
        <p>{problem.description}</p>

        {problem.constraints && problem.constraints.length > 0 && (
          <div className="constraints">
            <h3>Constraints:</h3>
            <ul>
              {problem.constraints.map((constraint, i) => (
                <li key={i}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="examples">
          <h3>Examples:</h3>
          {problem.examples.map((example, i) => (
            <div key={i} className="example">
              <div className="example-input">
                <strong>Input:</strong> <code>{example.input}</code>
              </div>
              <div className="example-output">
                <strong>Output:</strong> <code>{example.output}</code>
              </div>
              {example.explanation && (
                <div className="example-explanation">
                  <strong>Explanation:</strong> {example.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
