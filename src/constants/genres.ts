export interface GenreOption {
  label: string;
  value: string;
}

// Gêneros aceitos pela API. `value` é o que o backend espera (sem acento).
export const GENRE_OPTIONS: GenreOption[] = [
  { label: 'Ficção Científica', value: 'Ficcao Cientifica' },
  { label: 'Ação', value: 'Acao' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Comédia', value: 'Comedia' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'Suspense', value: 'Suspense' },
  { label: 'Terror', value: 'Terror' },
  { label: 'Animação', value: 'Animacao' },
];
