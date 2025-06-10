import { useState } from 'react';
import { DBConnectForm } from './components/DBConnectForm';
import { TableList } from './components/TableList';
import { connect, fetchTables } from './services/api';

function App() {
  const [tables, setTables] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const handleConnect = async (config: any) => {
    await connect(config);
    setConnected(true);
    const t = await fetchTables();
    setTables(t);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>ServiceBuilder</h1>
      {!connected && <DBConnectForm onConnect={handleConnect} />}
      {connected && <TableList tables={tables} onSelect={table => console.log('select', table)} />}
    </div>
  );
}

export default App;
