import { useState } from 'react';
import { connect, fetchTables } from '../services/api';
import { StepConnect } from '../components/wizard/StepConnect';
import { StepSelect } from '../components/wizard/StepSelect';
import { StepConfigure } from '../components/wizard/StepConfigure';
import { StepReview } from '../components/wizard/StepReview';

function App() {
  const [step, setStep] = useState(0);
  const [tables, setTables] = useState<string[]>([]);

  const handleConnect = async (config: any) => {
    await connect(config);
    const t = await fetchTables();
    setTables(t);
    setStep(1);
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">Setup | Table | API | Preview</aside>
      <main className="main">
        {step === 0 && <StepConnect onNext={handleConnect} />}
        {step === 1 && <StepSelect tables={tables} onNext={(_t) => setStep(2)} />}
        {step === 2 && <StepConfigure onNext={() => setStep(3)} />}
        {step === 3 && <StepReview onGenerate={() => setStep(0)} />}
      </main>
    </div>
  );
}

export default App;
