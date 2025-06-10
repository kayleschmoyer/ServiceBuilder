import { useState } from 'react';
import { fetchTables, runExport } from '../../services/api';

// Review step shows the SQL, endpoint path and lets the user test it
export function StepReview({ onGenerate, exportConfig }: { onGenerate: () => void; exportConfig: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const sql = 'SELECT * FROM my_table';
  const path = '/api/generated/sample';

  const handleTest = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (exportConfig) {
        data = await runExport(exportConfig);
      } else {
        data = await fetchTables();
      }
      setResult(data);
    } catch (e) {
      setError('Failed to test endpoint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-step">
      <h2>Review &amp; Generate API</h2>
      <pre className="sql-preview">{sql}</pre>
      <div className="endpoint-path">Path: {path}</div>
      <button className="test-btn" onClick={handleTest}>Test</button>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!!result && (
        <pre className="result-preview">{JSON.stringify(result, null, 2)}</pre>
      )}
      <button className="generate-btn" onClick={onGenerate}>Generate</button>
    </div>
  );
}
