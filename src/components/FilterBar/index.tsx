import { useState } from 'react';
import { Search, X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import type { MovieSortBy, SortOrder } from '../../api/services/movieService';
import { GENRE_OPTIONS } from '../../constants/genres';
import './styles.css';

// "Todos" limpa o filtro de gênero; os demais vêm da lista compartilhada
const GENRE_FILTER_OPTIONS = [{ label: 'Todos', value: '' }, ...GENRE_OPTIONS];

const RATING_OPTIONS = [
  { label: 'Qualquer nota', value: '' },
  { label: 'Nota 9+', value: '9' },
  { label: 'Nota 8+', value: '8' },
  { label: 'Nota 7+', value: '7' },
  { label: 'Nota 6+', value: '6' },
  { label: 'Nota 5+', value: '5' },
  { label: 'Nota 4+', value: '4' },
  { label: 'Nota 3+', value: '3' },
  { label: 'Nota 2+', value: '2' },
  { label: 'Nota 1+', value: '1' },
];

export interface FilterState {
  search: string;
  genre: string[]; // Agora suporta múltiplos gêneros
  director: string;
  releaseYear: string;
  minRating: string;
  sortBy: MovieSortBy;
  order: SortOrder;
}

export const INITIAL_FILTERS: FilterState = {
  search: '',
  genre: [],
  director: '',
  releaseYear: '',
  minRating: '',
  sortBy: 'createdAt',
  order: 'desc',
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
}

export const FilterBar = ({ filters, onFilterChange, onReset }: FilterBarProps) => {
  const [showMore, setShowMore] = useState(false);
  const updateField = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleGenreToggle = (genreValue: string) => {
    if (genreValue === '') {
      updateField('genre', []); // Limpa se clicar em "Todos"
      return;
    }
    
    const currentGenres = filters.genre;
    if (currentGenres.includes(genreValue)) {
      updateField('genre', currentGenres.filter((g) => g !== genreValue));
    } else {
      updateField('genre', [...currentGenres, genreValue]);
    }
  };

  const handleSortChange = (combinedValue: string) => {
    const [sortBy, order] = combinedValue.split('-') as [MovieSortBy, SortOrder];
    onFilterChange({ ...filters, sortBy, order });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.genre.length > 0 ||
    filters.director !== '' ||
    filters.releaseYear !== '' ||
    filters.minRating !== '' ||
    filters.sortBy !== 'createdAt' ||
    filters.order !== 'desc';

  return (
    <section className="filter-section">
      <div className="search-bar-wrapper">
        <Search className="search-bar-icon" size={18} />
        <input
          type="text"
          className="search-bar-input"
          placeholder="Pesquisar por título do filme..."
          value={filters.search}
          onChange={(e) => updateField('search', e.target.value)}
        />
        {filters.search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => updateField('search', '')}
            aria-label="Limpar pesquisa"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="genre-pills-row">
        {GENRE_FILTER_OPTIONS.map((item) => {
          const isActive =
            item.value === ''
              ? filters.genre.length === 0
              : filters.genre.includes(item.value);

          return (
            <button
              key={item.label}
              type="button"
              className={`genre-pill ${isActive ? 'active' : ''}`}
              onClick={() => handleGenreToggle(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Só aparece no celular/tablet vertical: recolhe os filtros secundários */}
      <button
        type="button"
        className="more-filters-toggle"
        aria-expanded={showMore}
        onClick={() => setShowMore((open) => !open)}
      >
        <SlidersHorizontal size={16} />
        {showMore ? 'Menos filtros' : 'Mais filtros'}
        {hasActiveFilters && <span className="filters-active-dot" aria-label="Há filtros ativos" />}
      </button>

      <div className={`secondary-filters-row ${showMore ? 'open' : ''}`}>
        <div className="compact-control">
          <label htmlFor="filter-director">Diretor</label>
          <input
            id="filter-director"
            type="text"
            placeholder="Ex: Christopher Nolan"
            value={filters.director}
            onChange={(e) => updateField('director', e.target.value)}
          />
        </div>

        <div className="compact-control compact-year">
          <label htmlFor="filter-year">Ano</label>
          <input
            id="filter-year"
            type="number"
            placeholder="Ex: 2014"
            min="1888"
            max="2099"
            value={filters.releaseYear}
            onChange={(e) => updateField('releaseYear', e.target.value)}
          />
        </div>

        <div className="compact-control">
          <label htmlFor="filter-rating">Avaliação</label>
          <select
            id="filter-rating"
            value={filters.minRating}
            onChange={(e) => updateField('minRating', e.target.value)}
          >
            {RATING_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="compact-control">
          <label htmlFor="filter-sort">Ordenar por</label>
          <select
            id="filter-sort"
            value={`${filters.sortBy}-${filters.order}`}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="createdAt-desc">Recém adicionados</option>
            <option value="rating-desc">Maior nota</option>
            <option value="rating-asc">Menor nota</option>
            <option value="releaseYear-desc">Ano (Mais novos)</option>
            <option value="releaseYear-asc">Ano (Mais antigos)</option>
            <option value="title-asc">Título (A - Z)</option>
            <option value="title-desc">Título (Z - A)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button type="button" className="reset-filters-btn" onClick={onReset}>
            <RotateCcw size={15} />
            Limpar filtros
          </button>
        )}
      </div>
    </section>
  );
};