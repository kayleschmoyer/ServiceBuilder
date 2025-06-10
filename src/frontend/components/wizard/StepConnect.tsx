import { DBConnectForm } from '../DBConnectForm';

export function StepConnect({ onNext }: { onNext: (config:any) => void }) {
  return (
    <div className="wizard-step">
      <h2>Connect to Database</h2>
      <DBConnectForm onConnect={onNext} />
    </div>
  );
}
