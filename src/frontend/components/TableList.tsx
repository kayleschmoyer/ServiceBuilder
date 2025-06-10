export function TableList({ tables, onSelect }: { tables: string[]; onSelect: (t: string) => void }) {
  return (
    <ul className="table-list">
      {tables.map(t => (
        <li className="table-item" key={t} onClick={() => onSelect(t)} style={{ cursor: 'pointer' }}>{t}</li>
      ))}
    </ul>
  );
}
