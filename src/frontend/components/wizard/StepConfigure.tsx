import { useState } from 'react';

// Configure filters, sort and paging for the query
export function StepConfigure({ onNext }: { onNext: () => void }) {
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('asc');
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="wizard-step">
      <h2>Configure Fields &amp; Filters</h2>
      <div className="config-form">
        {/* Simple text filter expression */}
        <input
          className="filter-input"
          placeholder="Filter (e.g. id > 5)"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        {/* Dropdown for sort order */}
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        {/* Page size selection */}
        <input
          type="number"
          min={1}
          className="page-input"
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        />
      </div>
      <button className="next-btn" onClick={onNext}>Next</button>
    </div>
  );
}
