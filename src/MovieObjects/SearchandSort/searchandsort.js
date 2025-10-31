import React from "react";
import './searchandsort.css';

export default function SearchAndSort({ searchTerm, onSearchTermChange, sortKey, onSortChange }) {
  return (
    <div className="search-container">
      <input
        id="search-input"
        className="search-bar"
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      <select id="sort" className="sort-dropdown" value={sortKey} onChange={(e) => onSortChange(e.target.value)}>
        <option value="">Sort By</option>
        <option value="year-asc">Release Date (Ascending)</option>
        <option value="year-desc">Release Date (Descending)</option>
        <option value="rating-asc">Rating (Ascending)</option>
        <option value="rating-desc">Rating (Descending)</option>
      </select>
    </div>
  );
}

