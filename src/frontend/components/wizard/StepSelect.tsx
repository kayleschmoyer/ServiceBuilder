export function StepSelect({ tables, onNext }: { tables: string[]; onNext: (table:string) => void }) {
  return (
    <div className="wizard-step">
      <h2>Select Table or Query</h2>
      <select onChange={e => onNext(e.target.value)} className="table-select">
        <option value="">--choose table--</option>
        {tables.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <textarea placeholder="Or write custom SQL" className="query-input" />
      <button className="next-btn" onClick={() => onNext('')}>Next</button>
    </div>
  );
}
