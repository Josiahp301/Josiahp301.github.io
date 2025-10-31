import React, {useState, useEffect, useRef, useMemo} from 'react';
import Header from "./MovieObjects/Header/header";
import Pagination from './MovieObjects/pagination/pagination';
import SearchAndSort from './MovieObjects/SearchandSort/searchandsort';
import MovieCard from './MovieObjects/MovieCard/moviecard';
import useDebounce from './MovieObjects/debounce';

const API = 'https://api.themoviedb.org/3/movie/popular?language=en-US'
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?language=en-US'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w300'


function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300)
  const [sortKey, setSortKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    const query = debouncedSearch.trim();
    const url = query ? `${SEARCH_API}&query=${encodeURIComponent(query)}&page=${page}` : `${API}&page=${page}`;

    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    const bearerToken = process.env.REACT_APP_TMDB_BEARER;
    const apiKey = process.env.REACT_APP_TMDB_API_KEY;

    const headers = { Accept: 'application/json' };
    if (bearerToken) headers.Authorization = `Bearer ${bearerToken}`;

    const finalUrl = apiKey ? `${url}&api_key=${apiKey}` : url;


    fetch(finalUrl, { method: 'GET', headers, signal })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network Response Failed ' + res.status + ' ' + res.statusText);
        }
        return res.json();
      })
      .then(data => {
        setMovies(Array.isArray(data.results) ? data.results : []);
        setPage(Number(data.page) || page);
        setTotalPages(Number(data.total_pages) || 1);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err.message || String(err));
      })
      .finally(() => {
        setLoading(false);
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      });

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
        abortRef.current = null;
      }
    };
  }, [debouncedSearch, page]);

  const sortedMovies = useMemo(() => {
    const list = (movies || []).slice();
    switch (sortKey) {
      case 'year-asc':
        list.sort((a, b) => (new Date(a.release_date || 0) - new Date(b.release_date || 0)));
        break;
      case 'year-desc':
        list.sort((a, b) => (new Date(b.release_date || 0) - new Date(a.release_date || 0)));
        break;
      case 'rating-asc':
        list.sort((a, b) => ((Number(a.vote_average) || 0) - (Number(b.vote_average) || 0)));
        break;
      case 'rating-desc':
        list.sort((a, b) => ((Number(b.vote_average) || 0) - (Number(a.vote_average) || 0)));
        break;
      default:
        break;
    }
    return list;
  }, [movies, sortKey]);

  return (
    <div>
      <Header />

      <SearchAndSort
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        sortKey={sortKey}
        onSortChange={setSortKey}
      />

      <div id="movie-container" className="movie-grid">
        {sortedMovies.map(m => <MovieCard key={m.id} movie={m} imageBase={IMAGE_BASE} />)}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => { if (p >= 1 && p <= totalPages) setPage(p); }}
      />

    </div>

  );
}

export default App;
