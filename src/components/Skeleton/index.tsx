import './styles.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

// Bloco genérico caso precise usar em textos ou perfis futuramente
export const Skeleton = ({
  width = '100%',
  height = '20px',
  borderRadius = '6px',
  className = '',
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton-base ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

// Esqueleto completo do card para a página de Catálogo (Filmes)
export const MovieCardSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-movie-card">
          <div className="skeleton-base skeleton-poster-area" />
          <div className="skeleton-base skeleton-title-line" />
          <div className="skeleton-base skeleton-meta-line" />
          <div className="skeleton-base skeleton-genre-line" />
        </div>
      ))}
    </>
  );
};

// Esqueleto apenas do pôster para a DashboardView na Home
export const PosterSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-base skeleton-dashboard-poster" />
      ))}
    </>
  );
};