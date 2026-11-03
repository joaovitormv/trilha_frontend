import React from 'react';
import { VisitorView } from './visitorView';
import { DashboardView } from './dashboardView';
import type { User } from '../../api/types/user.types';
import './styles.css';

export const Home = () => {
  const token = localStorage.getItem('@CineComp:token');
  const storedUser = localStorage.getItem('@CineComp:user');
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = Boolean(token);

  return (
    <div className="home-main-content">
      {isAuthenticated ? <DashboardView user={user} /> : <VisitorView />}
    </div>
  );
};