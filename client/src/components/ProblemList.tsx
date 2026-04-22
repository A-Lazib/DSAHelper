import React from 'react';
import type { Problem } from '../types/index';
import '../styles/ProblemList.css';

interface ProblemListProps {
  problems: Problem[];
  selectedProblemId: string | null;
  onSelectProblem: (id: string) => void;
}

export const ProblemList: React.FC<ProblemListProps> = ({ problems, selectedProblemId, onSelectProblem }) => {
  return (
    <div className="problem-list">
      <h2>Choose a question</h2>
      <div className="problems-container">
        {problems.map((problem) => (
          <button
            key={problem.id}
            className={`problem-item ${selectedProblemId === problem.id ? 'active' : ''}`}
            onClick={() => onSelectProblem(problem.id)}
          >
            <div className="problem-title">{problem.title}</div>
            <div className="problem-meta">
              <span className={`difficulty ${problem.difficulty}`}>{problem.difficulty}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
