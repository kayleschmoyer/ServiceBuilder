import { useState } from 'react';

// Configure filters, sort and paging for the query
export function StepConfigure({ onNext }: { onNext: () => void }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="wizard-step">
      <h2>Configure Fields &amp; Filters</h2>
      <div className="form-group">
        <label>Filter</label>
        <input placeholder="id > 5" value={filter} onChange={e => setFilter(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Sort Order</label>
        <select value={sort} onChange={e => setSort(e.target.value as any)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="form-group">
        <label>Page Size</label>
        <input type="number" min={1} value={pageSize} onChange={e => setPageSize(Number(e.target.value))} />
      </div>
      <button className="btn btn-primary" onClick={onNext}>Next</button>
    </div>
  );
}
