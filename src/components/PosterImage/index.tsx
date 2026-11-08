import { useState, type ReactNode } from 'react';

interface PosterImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  /** Exibido quando não há URL ou quando a imagem não consegue ser carregada. */
  fallback: ReactNode;
}

// Imagem de pôster com fallback. A URL é digitada pelo usuário, então pode estar
// vazia, quebrada ou apontar para um arquivo que não existe mais.
export const PosterImage = ({ src, alt, className, fallback }: PosterImageProps) => {
  // Guardamos a URL que falhou (e não um booleano): se `src` mudar, por exemplo
  // ao editar o pôster, a nova URL é tentada de novo sem precisar "resetar" nada.
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <>{fallback}</>;
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailedSrc(src)} />;
};
