import React from 'react';
import Editor from '@monaco-editor/react';
import '../styles/CodeEditor.css';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onSubmit: (mode: 'debug' | 'feedback' | 'hints') => void;
  loading: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onCodeChange, onSubmit, loading }) => {
  return (
    <div className="code-editor">
      <div className="editor-monaco-shell">
        <Editor
          height="100%"
          defaultLanguage="python"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => onCodeChange(value ?? '')}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineHeight: 24,
            smoothScrolling: true,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            renderLineHighlight: 'line',
            glyphMargin: false,
            folding: true,
            lineNumbers: 'on',
            formatOnType: true,
            formatOnPaste: true,
            scrollBeyondLastLine: false,
            placeholder: 'Write your Python solution here...'
          }}
        />
      </div>
      <div className="editor-controls">
        <button onClick={() => onSubmit('debug')} disabled={loading} className="btn btn-primary">
          {loading ? 'Analyzing...' : 'Debug'}
        </button>
        <button onClick={() => onSubmit('feedback')} disabled={loading} className="btn btn-secondary">
          {loading ? 'Evaluating...' : 'Get Feedback'}
        </button>
        <button onClick={() => onSubmit('hints')} disabled={loading} className="btn btn-tertiary">
          {loading ? 'Loading...' : 'Get Hints'}
        </button>
      </div>
    </div>
  );
};
