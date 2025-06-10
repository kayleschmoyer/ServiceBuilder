import { useState } from 'react';
import { fetchColumns } from '../../services/api';

// Step for choosing a table and previewing its columns
export function StepSelect({ tables, onNext }: { tables: string[]; onNext: (table: string) => void }) {
  const [selected, setSelected] = useState('');
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (tbl: string) => {
    setSelected(tbl);
    if (!tbl) return;
    setLoading(true);
    setError('');
    try {
      const cols = await fetchColumns(tbl);
      setColumns(cols);
    } catch (e) {
      setError('Failed to load columns');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-step">
      <h2>Select Table or Query</h2>
      <select className="table-select" onChange={e => handleSelect(e.target.value)} value={selected}>
        <option value="">--choose table--</option>
        {tables.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
      {!!columns.length && (
        <ul className="column-list">
          {columns.map(c => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}
      <textarea placeholder="Or write custom SQL" className="query-input" />
      <button className="next-btn" onClick={() => onNext(selected)}>Next</button>
    </div>
  );
}
