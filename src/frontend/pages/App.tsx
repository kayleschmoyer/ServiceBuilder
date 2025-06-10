import { useState } from 'react';
import { connect, fetchTables } from '../services/api';
import { StepConnect } from '../components/wizard/StepConnect';
import { StepSelect } from '../components/wizard/StepSelect';
import { StepConfigure } from '../components/wizard/StepConfigure';
import { StepReview } from '../components/wizard/StepReview';
import { StepExport } from '../components/wizard/StepExport';
import { ProgressSteps } from '../components/ui/ProgressSteps';

function App() {
  const steps = ['Connect', 'Select', 'Configure', 'Export', 'Review'];
  const [step, setStep] = useState(0);
  const [tables, setTables] = useState<string[]>([]);
  const [exportConfig, setExportConfig] = useState<any>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleConnect = async (config: any) => {
    await connect(config);
    const t = await fetchTables();
    setTables(t);
    setStep(1);
  };

  return (
    <div className="app-layout">
      <main className="main">
        <ProgressSteps steps={steps} active={step} />
        {step === 0 && <StepConnect onNext={handleConnect} onSuccess={() => showToast('Connected successfully')} />}
        {step === 1 && <StepSelect tables={tables} onNext={(_t) => setStep(2)} />}
        {step === 2 && <StepConfigure onNext={() => setStep(3)} />}
        {step === 3 && (
          <StepExport columns={[]} onNext={(cfg) => { setExportConfig(cfg); setStep(4); }} />
        )}
        {step === 4 && <StepReview exportConfig={exportConfig} onGenerate={() => setStep(0)} />}
      </main>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
