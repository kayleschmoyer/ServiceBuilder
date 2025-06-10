export function StepReview({ onGenerate }: { onGenerate: () => void }) {
  return (
    <div className="wizard-step">
      <h2>Review & Generate API</h2>
      <div className="review-placeholder">Preview will appear here</div>
      <button className="generate-btn" onClick={onGenerate}>Generate</button>
    </div>
  );
}
