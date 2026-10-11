import React from 'react';
import './styles.css'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, ...props }: ButtonProps) => {
  return (
    <button className="custom-btn" {...props}>
      {children}
    </button>
  );
};