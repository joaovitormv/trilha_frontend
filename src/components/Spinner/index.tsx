import React from 'react';
import './styles.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'purple' | 'white';
  centered?: boolean;
  label?: string;
}

export const Spinner = ({
  size = 'md',
  color = 'purple',
  centered = false,
  label,
}: SpinnerProps) => {
  const spinnerElement = (
    <div className="spinner-inline-container">
      <div
        className={`spinner-circle spinner-${size} spinner-${color}`}
        role="status"
        aria-label="Carregando"
      />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );

  if (centered) {
    return <div className="spinner-centered-wrapper">{spinnerElement}</div>;
  }

  return spinnerElement;
};