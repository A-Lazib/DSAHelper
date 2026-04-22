import React, { useState } from 'react';
import type { HintResponse } from '../types/index';
import '../styles/HintsPanel.css';

interface HintsPanelProps {
  hints: HintResponse | null;
  loading: boolean;
  onRequestHint: (level: 1 | 2 | 3) => void;
}

export const HintsPanel: React.FC<HintsPanelProps> = ({ hints, loading, onRequestHint }) => {
  const [revealedLevel, setRevealedLevel] = useState<number | null>(null);

  const handleRevealHint = (level: 1 | 2 | 3) => {
    setRevealedLevel(level);
    onRequestHint(level);
  };

  return (
    <div className="hints-panel">
      <div className="hints-header">
        <h3>Progressive Hints</h3>
        <p className="hints-description">Start with basic guidance and progressively reveal more details</p>
      </div>

      <div className="hints-levels">
        <button
          className={`hint-level-btn ${revealedLevel === 1 ? 'active' : ''}`}
          onClick={() => handleRevealHint(1)}
          disabled={loading}
        >
          <span className="level-number">Level 1</span>
          <span className="level-description">Data Structure & Complexity</span>
        </button>

        <button
          className={`hint-level-btn ${revealedLevel === 2 ? 'active' : ''}`}
          onClick={() => handleRevealHint(2)}
          disabled={loading}
        >
          <span className="level-number">Level 2</span>
          <span className="level-description">Approach & Pattern</span>
        </button>

        <button
          className={`hint-level-btn ${revealedLevel === 3 ? 'active' : ''}`}
          onClick={() => handleRevealHint(3)}
          disabled={loading}
        >
          <span className="level-number">Level 3</span>
          <span className="level-description">Strategy & Pseudo-code</span>
        </button>
      </div>

      {loading && <div className="loading">Loading hint...</div>}

      {hints && !loading && (
        <div className="hint-content">
          <div className={`hint-text level-${hints.level}`}>{hints.hint}</div>
          {hints.nextLevelAvailable && hints.level < 3 && (
            <div className="hint-footer">Next level available for more guidance</div>
          )}
        </div>
      )}

      {!hints && !loading && (
        <div className="empty">Click on a hint level to get started</div>
      )}
    </div>
  );
};
