import { useState } from 'react';

export function DBConnectForm({ onConnect }: { onConnect: (config: any) => void }) {
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('1433');
  const [database, setDatabase] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!host || !port || !database || !user || !password) {
      setError('All fields are required.');
      return;
    }

    const config = { host, port, database, user, password };
    console.log('🔌 Connecting with config:', config);
    setError('');
    onConnect(config);
  };

  return (
    <form className="connect-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Host</label>
        <input
          value={host}
          onChange={e => setHost(e.target.value)}
          placeholder="db.company.com"
        />
      </div>

      <div className="form-group">
        <label>Port</label>
        <input
          value={port}
          onChange={e => setPort(e.target.value)}
          placeholder="1433"
        />
      </div>

      <div className="form-group">
        <label>Database</label>
        <input
          value={database}
          onChange={e => setDatabase(e.target.value)}
          placeholder="mydb"
        />
      </div>

      <div className="form-group">
        <label>User</label>
        <input
          value={user}
          onChange={e => setUser(e.target.value)}
          placeholder="readonly_user"
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="******"
        />
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <button className="btn btn-primary" type="submit">
          Connect
        </button>
      </div>
    </form>
  );
}
