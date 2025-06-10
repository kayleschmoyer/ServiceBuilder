export function StepConfigure({ onNext }: { onNext: () => void }) {
  return (
    <div className="wizard-step">
      <h2>Configure Fields & Filters</h2>
      <div className="config-placeholder">Configuration UI here</div>
      <button className="next-btn" onClick={onNext}>Next</button>
    </div>
  );
}
