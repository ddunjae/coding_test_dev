import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import Layout from '../components/layout/Layout';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { fetchProblem } from '../store/slices/problemsSlice';
import { problemsApi } from '../api/services';

interface TestCase {
  input: string;
  output: string;
  result?: string;
  status?: 'success' | 'error' | 'running';
}

const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedProblem: problem, loading, error } = useAppSelector((state) => state.problems);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [runningTests, setRunningTests] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProblem(parseInt(id)));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (problem?.testCases) {
      setTestCases(problem.testCases.map(tc => ({ ...tc, status: 'running' })));
    }
  }, [problem]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
    }
  };

  const runTestCases = async () => {
    if (!id) return;
    
    setRunningTests(true);
    setTestCases(prev => prev.map(tc => ({ ...tc, status: 'running' })));
    
    try {
      const results: TestCase[] = await Promise.all(
        testCases.map(async (testCase) => {
          try {
            const response = await problemsApi.runTestCase({
              problemId: parseInt(id),
              code,
              language,
              input: testCase.input
            });
            return {
              ...testCase,
              result: response.data.output,
              status: response.data.output === testCase.output ? 'success' as const : 'error' as const
            };
          } catch (err) {
            return {
              ...testCase,
              result: 'Error running test case',
              status: 'error' as const
            };
          }
        })
      );
      
      setTestCases(results);
    } catch (err) {
      setSubmitError('Failed to run test cases');
    } finally {
      setRunningTests(false);
    }
  };

  const handleSubmit = async () => {
    if (!id) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await problemsApi.submitCode({
        problemId: parseInt(id),
        code,
        language
      });
      
      navigate('/submissions');
    } catch (err) {
      setSubmitError('Failed to submit code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !problem) {
    return (
      <Layout>
        <div className="text-center text-red-500">
          <p>Error: {error || 'Problem not found'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
          <div className="flex items-center space-x-4">
            <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {problem.difficulty}
            </span>
            <span className="text-sm text-gray-500">{problem.category}</span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="whitespace-pre-wrap">{problem.description}</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Solution</h2>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 border rounded-md"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="h-[400px] border rounded-md overflow-hidden">
              <Editor
                height="100%"
                defaultLanguage={language}
                language={language}
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
            {submitError && (
              <div className="text-red-500 text-sm">{submitError}</div>
            )}
            <div className="flex space-x-4">
              <button
                onClick={runTestCases}
                disabled={runningTests || !code.trim()}
                className={`px-6 py-2 rounded-md text-white font-semibold ${
                  runningTests || !code.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {runningTests ? 'Running Tests...' : 'Run Tests'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !code.trim()}
                className={`px-6 py-2 rounded-md text-white font-semibold ${
                  submitting || !code.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>

        {testCases.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Cases</h2>
            <div className="space-y-4">
              {testCases.map((testCase, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Input:</h3>
                      <pre className="bg-gray-50 p-2 rounded">{testCase.input}</pre>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Expected Output:</h3>
                      <pre className="bg-gray-50 p-2 rounded">{testCase.output}</pre>
                    </div>
                  </div>
                  {testCase.status !== 'running' && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Your Output:</h3>
                      <pre className={`p-2 rounded ${
                        testCase.status === 'success' ? 'bg-green-50' :
                        testCase.status === 'error' ? 'bg-red-50' : 'bg-gray-50'
                      }`}>
                        {testCase.result}
                      </pre>
                      {testCase.status === 'success' && (
                        <span className="text-green-600 text-sm">✓ Test case passed</span>
                      )}
                      {testCase.status === 'error' && (
                        <span className="text-red-600 text-sm">✗ Test case failed</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProblemDetail; 