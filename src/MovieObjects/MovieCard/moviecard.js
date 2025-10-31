import React from "react";
import './moviecard.css';

export default function MovieCard({ movie, imageBase }) {
  const placeholder = "";
  const src = movie && movie.poster_path ? (imageBase + movie.poster_path) : placeholder;
  return (
    <div className="movie-card">
      <img className="movie-image" src={src} alt={movie?.title || movie?.name || "Untitled"} />
      <div className="title">{movie?.title || movie?.name || "untitled"}</div>
      <div className="release-date">Release date: {movie?.release_date || "unknown"}</div>
      <div className="rating">Rating: { (typeof movie?.vote_average === 'number') ? movie.vote_average.toFixed(1) : 'N/A' }</div>
    </div>
  );
}

