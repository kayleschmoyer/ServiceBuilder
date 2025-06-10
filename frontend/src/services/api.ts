export async function connect(config: any) {
  const res = await fetch('/api/connect', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  return res.json();
}

export async function fetchTables() {
  const res = await fetch('/api/tables');
  return res.json();
}
