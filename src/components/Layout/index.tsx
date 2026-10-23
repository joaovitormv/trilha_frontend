import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import './styles.css';

export const BaseLayout = () => {
  return (
    <div className="layout-container">
      <Header />
      
      <main className="layout-main">
        <Outlet /> 
      </main>

      <Footer />
    </div>
  );
};