import { useState } from 'react';

interface ColumnConfig {
  name: string;
  rename: string;
}

interface ExportOptions {
  format: 'csv' | 'json';
  delimiter: string;
  fileName: string;
  columns: ColumnConfig[];
}

interface SftpOptions {
  host: string;
  port: string;
  username: string;
  password: string;
  remoteDir: string;
  enabled: boolean;
}

export function StepExport({ columns, onNext }: { columns: string[]; onNext: (opts: { export: ExportOptions; sftp: SftpOptions }) => void }) {
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [delimiter, setDelimiter] = useState(',');
  const [fileName, setFileName] = useState('export_YYYYMMDD_HHmmss');
  const [colConfig, setColConfig] = useState<ColumnConfig[]>(
    columns.map(c => ({ name: c, rename: c }))
  );
  const [sftpEnabled, setSftpEnabled] = useState(false);
  const [sftpHost, setSftpHost] = useState('');
  const [sftpPort, setSftpPort] = useState('22');
  const [sftpUser, setSftpUser] = useState('');
  const [sftpPass, setSftpPass] = useState('');
  const [sftpDir, setSftpDir] = useState('/');

  const move = (idx: number, dir: number) => {
    const arr = [...colConfig];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    const tmp = arr[idx];
    arr[idx] = arr[target];
    arr[target] = tmp;
    setColConfig(arr);
  };

  return (
    <div className="wizard-step">
      <h2>Export Options</h2>
      <div className="export-form">
        <label>
          Format
          <select value={format} onChange={e => setFormat(e.target.value as any)}>
            <option value="csv">CSV</option>
            <option value="json">JSON</option>
          </select>
        </label>
        {format === 'csv' && (
          <label>
            Delimiter
            <input value={delimiter} onChange={e => setDelimiter(e.target.value)} />
          </label>
        )}
        <label>
          File Name Pattern
          <input value={fileName} onChange={e => setFileName(e.target.value)} />
        </label>
        <h3>Columns</h3>
        <ul className="column-config">
          {colConfig.map((c, idx) => (
            <li key={c.name}>
              <input value={c.rename} onChange={e => {
                const arr = [...colConfig];
                arr[idx] = { ...arr[idx], rename: e.target.value };
                setColConfig(arr);
              }} />
              <button type="button" onClick={() => move(idx, -1)}>↑</button>
              <button type="button" onClick={() => move(idx, 1)}>↓</button>
            </li>
          ))}
        </ul>
      </div>
      <h2>SFTP Delivery</h2>
      <label>
        <input type="checkbox" checked={sftpEnabled} onChange={e => setSftpEnabled(e.target.checked)} />
        Send to SFTP after export
      </label>
      {sftpEnabled && (
        <div className="sftp-form">
          <input placeholder="Host" value={sftpHost} onChange={e => setSftpHost(e.target.value)} />
          <input placeholder="Port" value={sftpPort} onChange={e => setSftpPort(e.target.value)} />
          <input placeholder="Username" value={sftpUser} onChange={e => setSftpUser(e.target.value)} />
          <input placeholder="Password" type="password" value={sftpPass} onChange={e => setSftpPass(e.target.value)} />
          <input placeholder="Remote directory" value={sftpDir} onChange={e => setSftpDir(e.target.value)} />
        </div>
      )}
      <button
        className="next-btn"
        onClick={() =>
          onNext({
            export: { format, delimiter, fileName, columns: colConfig },
            sftp: {
              host: sftpHost,
              port: sftpPort,
              username: sftpUser,
              password: sftpPass,
              remoteDir: sftpDir,
              enabled: sftpEnabled
            }
          })
        }
      >
        Next
      </button>
    </div>
  );
}
