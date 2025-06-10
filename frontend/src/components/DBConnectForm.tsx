import { useState } from 'react';

export function DBConnectForm({ onConnect }: { onConnect: (config: any) => void }) {
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [database, setDatabase] = useState('');
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={e => { e.preventDefault(); onConnect({ host, port, database, user, password }); }}>
      <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />
      <input placeholder="Port" value={port} onChange={e => setPort(e.target.value)} />
      <input placeholder="Database" value={database} onChange={e => setDatabase(e.target.value)} />
      <input placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Connect</button>
    </form>
  );
}
