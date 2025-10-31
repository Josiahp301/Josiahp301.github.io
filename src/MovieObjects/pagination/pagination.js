import React from "react";
import './pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination-bar">
      <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
      <div className="pagination-info">Page {currentPage} of {totalPages}</div>
      <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
    </div>
  );
}

