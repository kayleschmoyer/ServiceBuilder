import { useState } from 'react';
import { fetchTables, runExport } from '../../services/api';

// Review step shows the SQL, endpoint path and lets the user test it
export function StepReview({ onGenerate, exportConfig }: { onGenerate: () => void; exportConfig: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any[]>([]);

  const sql = 'SELECT * FROM my_table';
  const path = '/api/generated/sample';
  const fileName = exportConfig?.export?.fileName || 'export';
  const format = exportConfig?.export?.format || 'csv';
  const sftp = exportConfig?.sftp;

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
      <h2>Review &amp; Generate</h2>
      <div className="form-group">
        <label>SQL</label>
        <pre className="sql-preview">{sql}</pre>
      </div>
      <div className="form-group">
        <label>Output File</label>
        <div>{fileName}.{format}</div>
      </div>
      {sftp?.enabled && (
        <div className="form-group">
          <label>SFTP Destination</label>
          <div>{sftp.username}@{sftp.host}:{sftp.port}{sftp.remoteDir}</div>
        </div>
      )}
      <button className="btn btn-secondary" onClick={handleTest}>Test</button>
      {loading && (
        <div className="loading">
          <div className="spinner" /> Loading...
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {!!result.length && (
        <pre className="result-preview">{JSON.stringify(result.slice(0,5), null, 2)}</pre>
      )}
      <button className="btn btn-primary" onClick={onGenerate}>Generate</button>
    </div>
  );
}
