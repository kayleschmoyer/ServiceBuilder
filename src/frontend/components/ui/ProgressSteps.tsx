import React from 'react';

export function ProgressSteps({ steps, active }: { steps: string[]; active: number }) {
  return (
    <ol className="progress-steps">
      {steps.map((label, i) => (
        <li key={label} className={i === active ? 'active' : i < active ? 'done' : ''}>
          <span className="step-index">{i + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  );
}
