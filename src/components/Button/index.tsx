import React from 'react';
import { Spinner } from '../Spinner';
import './styles.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const Button = ({ children, isLoading = false, disabled, ...props }: ButtonProps) => {
  return (
    <button className="custom-btn" disabled={isLoading || disabled} {...props}>
      {isLoading ? (
        <span className="btn-loading-content">
          <Spinner size="sm" color="white" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};