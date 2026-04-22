import { useState, useEffect } from 'react';
import { ProblemList } from './components/ProblemList';
import { ProblemDescription } from './components/ProblemDescription';
import { CodeEditor } from './components/CodeEditor';
import { DebugPanel } from './components/DebugPanel';
import { FeedbackPanel } from './components/FeedbackPanel';
import { HintsPanel } from './components/HintsPanel';
import type { Problem, DebugResponse, FeedbackResponse, HintResponse } from './types/index';
import { problemAPI, debugAPI, feedbackAPI, hintAPI } from './services/api';
import './styles/App.css';

const PYTHON_STARTER_CODE: Record<string, string> = {
  'two-sum': `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass
`,
  'contains-duplicate': `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        # Write your solution here
        pass
`,
  'valid-parentheses': `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass
`,
  'longest-substring-without-repeating': `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Write your solution here
        pass
`,
  'merge-sorted-array': `class Solution:
    def merge(self, nums1: list[int], m: int, nums2: list[int], n: int) -> None:
        """
        Do not return anything, modify nums1 in-place instead.
        """
        # Write your solution here
        pass
`
};

const DEFAULT_PYTHON_SHELL = `class Solution:
    def solve(self):
        # Write your solution here
        pass
`;

function getStarterCode(problemId: string): string {
  return PYTHON_STARTER_CODE[problemId] ?? DEFAULT_PYTHON_SHELL;
}

export function App() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [viewMode, setViewMode] = useState<'picker' | 'workspace'>('picker');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [debugResult, setDebugResult] = useState<DebugResponse | null>(null);
  const [feedbackResult, setFeedbackResult] = useState<FeedbackResponse | null>(null);
  const [hints, setHints] = useState<HintResponse | null>(null);

  const [activeTab, setActiveTab] = useState<'debug' | 'feedback' | 'hints'>('debug');

  useEffect(() => {
    problemAPI.getAll().then(setProblems).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedProblemId) {
      problemAPI
        .getById(selectedProblemId)
        .then(setSelectedProblem)
        .catch(console.error);
      setCode(getStarterCode(selectedProblemId));
      setDebugResult(null);
      setFeedbackResult(null);
      setHints(null);
    }
  }, [selectedProblemId]);

  const openWorkspace = (problemId: string) => {
    setSelectedProblemId(problemId);
    setViewMode('workspace');
  };

  const backToPicker = () => {
    setViewMode('picker');
    setSelectedProblemId(null);
    setSelectedProblem(null);
    setCode('');
    setDebugResult(null);
    setFeedbackResult(null);
    setHints(null);
    setActiveTab('debug');
  };

  const handleSubmit = async (mode: 'debug' | 'feedback' | 'hints') => {
    if (!selectedProblemId || !code) return;

    setLoading(true);
    setActiveTab(mode);

    try {
      if (mode === 'debug') {
        const result = await debugAPI.analyze(selectedProblemId, code);
        setDebugResult(result);
      } else if (mode === 'feedback') {
        const result = await feedbackAPI.evaluate(selectedProblemId, code);
        setFeedbackResult(result);
      } else if (mode === 'hints') {
        const result = await hintAPI.getHint(selectedProblemId, 1, code);
        setHints(result);
      }
    } catch (error) {
      console.error(`Error in ${mode}:`, error);
      alert(`Failed to ${mode}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHint = async (level: 1 | 2 | 3) => {
    if (!selectedProblemId || !code) return;

    setLoading(true);

    try {
      const result = await hintAPI.getHint(selectedProblemId, level, code);
      setHints(result);
    } catch (error) {
      console.error('Error getting hint:', error);
      alert('Failed to get hint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (viewMode === 'picker') {
    return (
      <div className="app picker-view">
        <header className="picker-header">
          <div>
            <p className="eyebrow">AI DSA Interview Assistant</p>
            <h1>Choose a question</h1>
            <p className="picker-subtitle">
              Pick a problem to open the solving workspace in a LeetCode-style layout.
            </p>
          </div>
        </header>

        <main className="picker-content">
          <ProblemList
            problems={problems}
            selectedProblemId={selectedProblemId}
            onSelectProblem={openWorkspace}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="app workspace-view">
      <header className="workspace-header">
        <button className="back-button" onClick={backToPicker}>
          ← Questions
        </button>

        <div className="workspace-title-group">
          <p className="eyebrow">LeetCode-style workspace</p>
          <h1>{selectedProblem?.title ?? 'Problem Workspace'}</h1>
          <p className="workspace-subtitle">
            Statement on the left, solution editor on the right, analysis below.
          </p>
        </div>
      </header>

      <div className="workspace-shell">
        <section className="workspace-left-pane">
          <div className="pane-header">
            <span className="pane-label">Question</span>
          </div>
          <ProblemDescription problem={selectedProblem} />
        </section>

        <section className="workspace-right-pane">
          <div className="pane-header">
            <span className="pane-label">Code</span>
          </div>

          <div className="editor-host">
            <CodeEditor
              code={code}
              onCodeChange={setCode}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>

          <div className="results-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'debug' ? 'active' : ''}`}
                onClick={() => setActiveTab('debug')}
              >
                Debug
              </button>
              <button
                className={`tab ${activeTab === 'feedback' ? 'active' : ''}`}
                onClick={() => setActiveTab('feedback')}
              >
                Feedback
              </button>
              <button
                className={`tab ${activeTab === 'hints' ? 'active' : ''}`}
                onClick={() => setActiveTab('hints')}
              >
                Hints
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'debug' && (
                <DebugPanel debugResult={debugResult} loading={loading && activeTab === 'debug'} />
              )}
              {activeTab === 'feedback' && (
                <FeedbackPanel feedbackResult={feedbackResult} loading={loading && activeTab === 'feedback'} />
              )}
              {activeTab === 'hints' && (
                <HintsPanel
                  hints={hints}
                  loading={loading && activeTab === 'hints'}
                  onRequestHint={handleRequestHint}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
