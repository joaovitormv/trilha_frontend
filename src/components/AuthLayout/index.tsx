import React from 'react';
import './styles.css';

interface AuthLayoutProps {
  subtitle: string;
  title: string;
  imageSrc: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ subtitle, title, imageSrc, children }: AuthLayoutProps) => {
  return (
    <main className="auth-main-content">
      <div className="auth-split-card">
        <div className="auth-form-side">
          <div className="auth-content-wrapper">
            <div className="auth-titles">
              <p className="welcome-back">{subtitle}</p>
              <h1 className="main-title">{title}</h1>
            </div>

            {children}
          </div>
        </div>

        <div
          className="auth-image-side"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(13, 13, 13, 0.35), rgba(106, 13, 173, 0.25)), url(${imageSrc})`,
          }}
        />
      </div>
    </main>
  );
};