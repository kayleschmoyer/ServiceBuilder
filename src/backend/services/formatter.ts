export interface ColumnMap {
  name: string;
  rename: string;
}

export function applyColumnMap(rows: any[], columns: ColumnMap[]): any[] {
  return rows.map(r => {
    const out: any = {};
    columns.forEach(c => {
      out[c.rename] = r[c.name];
    });
    return out;
  });
}

export function formatCSV(rows: any[], delimiter = ','): string {
  if (!rows.length) return '';
  const header = Object.keys(rows[0]).join(delimiter);
  const lines = rows.map(r => Object.values(r).join(delimiter));
  return [header, ...lines].join('\n');
}

export function formatJSON(rows: any[]): string {
  return JSON.stringify(rows, null, 2);
}
