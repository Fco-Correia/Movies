"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const endpoint = searchTerm ? 'https://api.themoviedb.org/3/search/movie' : 'https://api.themoviedb.org/3/discover/movie';
        const response = await axios.get(endpoint, {
          params: {
            api_key: '7fbb9995674e82ad08d2fae163d5d057',
            primary_release_year: 2024,
            page: page,
            query: searchTerm,
            with_genres: genre
          }
        });
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, searchTerm, genre]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
          params: {
            api_key: '7fbb9995674e82ad08d2fae163d5d057'
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleSearchInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    setSearchTerm(query);
    setPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setPage(1);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (selectedMovie) {
    return (
      <div className={styles.container}>
        <div className={styles.movieDetails}>
          <h2>{selectedMovie.title}</h2>
          <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} className={styles.movieImage} />
          <p><strong>Synopsis:</strong> {selectedMovie.overview}</p>
          <p><strong>Rating:</strong> {selectedMovie.vote_average}</p>
          <button onClick={() => setSelectedMovie(null)}>Back to Movies</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.participants}>
        <h2>Feito por:</h2>
        <ul>
          <li>Francisco das Chagas Correia Neto</li>
          <li>Arthur Dutra Costa Lima</li>
          <li>Kauan Lucena de Almeida Amorim</li>
        </ul>
      </div>
      <h1 className={styles.title}>Movies of 2024</h1>
      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleSearchInputChange}
          onKeyDown={handleKeyPress}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
        <select value={genre} onChange={handleGenreChange} className={styles.genreSelect}>
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>
      <ul className={styles.moviesList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieItem} onClick={() => handleMovieClick(movie)}>
            <h2>{movie.title}</h2>
            <p>{movie.poster_path ? <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className={styles.movieImage} /> : 'No image available'}</p>
            <p><strong>Type:</strong> Movie</p>
            <p><strong>Genre:</strong> {movie.genre_ids.map((id) => genres.find(g => g.id === id)?.name).join(', ')}</p>
            <p><strong>Release Year:</strong> {new Date(movie.release_date).getFullYear()}</p>
          </li>
        ))}
      </ul>
      <div className={styles.pagination}>
        <button onClick={handlePrevPage} disabled={page === 1} className={styles.paginationButton}>Previous</button>
        <span className={styles.pageNumber}>Page {page}</span>
        <button onClick={handleNextPage} className={styles.paginationButton}>Next</button>
      </div>
    </div>
  );
};

export default HomePage;
