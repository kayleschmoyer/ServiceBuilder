// Base URL for backend API, falls back to same host if not specified
const API_URL = (import.meta as any).env.VITE_API_URL || '';

export async function connect(config: any) {
  const res = await fetch(`${API_URL}/api/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}

export async function fetchTables(connection: any) {
  const res = await fetch('/api/tables', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(connection)
  });

  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
}


export async function fetchColumns(table: string) {
  const res = await fetch(`${API_URL}/api/columns?table=${encodeURIComponent(table)}`);
  return res.json();
}

export async function runExport(config: any) {
  const res = await fetch(`${API_URL}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return res.json();
}
