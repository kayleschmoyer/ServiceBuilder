export function TableList({ tables, onSelect }: { tables: string[]; onSelect: (t: string) => void }) {
  return (
    <ul>
      {tables.map(t => (
        <li key={t} onClick={() => onSelect(t)} style={{ cursor: 'pointer' }}>{t}</li>
      ))}
    </ul>
  );
}
