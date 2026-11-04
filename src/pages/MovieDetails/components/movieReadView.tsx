import React, { useState } from 'react';
import { Heart, Pencil, Trash2, Star, Calendar, User, Film, Clock } from 'lucide-react';
import type { Movie } from '../../../api/types/movie.types';

interface Props {
  movie: Movie;
  onEdit: () => void;
  onDelete: () => void;
}

export const MovieReadView = ({ movie, onEdit, onDelete }: Props) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  return (
    <div className="details-card">
      <div className="details-poster-column">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} className="details-poster-img" />
        ) : (
          <div className="details-no-poster">
            <Film size={48} color="#555" />
            <span>Sem Pôster</span>
          </div>
        )}
      </div>

      <div className="details-info-column">
        <div className="details-header-group">
          <div className="title-and-rating">
            <h1 className="details-title">{movie.title}</h1>
            <div className="rating-badge">
              <Star size={18} color="#f5c518" fill="#f5c518" />
              <span>{movie.rating}</span>
              <span className="rating-max">/ 10</span>
            </div>
          </div>

          <div className="details-meta-pills">
            <span className="meta-pill"><Film size={15} />{movie.genre}</span>
            <span className="meta-pill"><Calendar size={15} />{movie.releaseYear}</span>
            <span className="meta-pill"><User size={15} />{movie.director}</span>
          </div>
        </div>

        <div className="details-description-box">
          <h3>Sinopse</h3>
          <p>{movie.description}</p>
        </div>

        <div className="details-timestamps">
          <span><Clock size={14} /> Adicionado em: {formatDate(movie.createdAt)}</span>
          <span><Clock size={14} /> Última atualização: {formatDate(movie.updatedAt)}</span>
        </div>

        <div className="details-actions-bar">
          <button
            type="button"
            className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart size={18} fill={isFavorite ? '#ff4d6d' : 'transparent'} color={isFavorite ? '#ff4d6d' : '#ffffff'} />
            <span>{isFavorite ? 'Adicionado aos Favoritos' : 'Adicionar aos Favoritos'}</span>
          </button>

          <div className="crud-buttons-group">
            <button type="button" className="action-btn edit-btn" onClick={onEdit}>
              <Pencil size={18} /><span>Editar</span>
            </button>
            <button type="button" className="action-btn delete-btn" onClick={onDelete}>
              <Trash2 size={18} /><span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};