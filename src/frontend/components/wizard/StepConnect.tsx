import { useState } from 'react';
import { DBConnectForm } from '../DBConnectForm';

// Step to connect to the database, displays loading/error states
export function StepConnect({ onNext, onSuccess }: { onNext: (config: any) => Promise<void>; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async (config: any) => {
    setLoading(true);
    setError('');
    try {
      await onNext(config);
      onSuccess();
    } catch (e) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-step">
      <h2>Connect to Database</h2>
      <DBConnectForm onConnect={handleConnect} />
      {loading && (
        <div className="loading">
          <div className="spinner" /> Connecting...
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
