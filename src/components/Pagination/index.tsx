import React from 'react';
import './styles.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Lógica para gerar a lista de números e reticências ('...')
  const getPageNumbers = () => {
    const pages = [];
    
    // Se tiver 5 páginas ou menos, mostra todas
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Se estiver nas primeiras páginas
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } 
      // Se estiver nas últimas páginas
      else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } 
      // Se estiver no meio
      else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-wrapper">
      {/* Botão Anterior */}
      <button
        className="page-nav-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo; Anterior
      </button>

      {/* Números e Reticências */}
      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={index}
            className={`page-button ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="page-ellipsis">
            {page}
          </span>
        )
      )}

      {/* Botão Próxima */}
      <button
        className="page-nav-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Próxima &raquo;
      </button>
    </div>
  );
};