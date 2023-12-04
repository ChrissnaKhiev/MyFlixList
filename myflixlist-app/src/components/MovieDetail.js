import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = ({ user }) => {
  const [movieDetails, setMovieDetails] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const { imdbID } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&i=${imdbID}`);
        if (response.data && response.data.Title) {
          setMovieDetails(response.data);
          fetchSimilarMovies(response.data.Title);
        } else {
          console.log('Movie data not found or invalid:', response.data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  const fetchSimilarMovies = async (title) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&s=${title}`);
      if (response.data.Search) {
        const filteredMovies = response.data.Search.filter(movie => movie.imdbID !== imdbID);
        setSimilarMovies(filteredMovies);
      } else {
        // If there are no similar movies, set the array to be empty
        setSimilarMovies([]);
      }
    } catch (error) {
      console.error('Error fetching similar movies:', error);
    }
  };

  const addToWatchlist = async (movie) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await axios.post('/add-to-watchlist', {
        title: movieDetails.Title,
        year: movieDetails.Year,
        poster: movieDetails.Poster,
        genre: movieDetails.Genre
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', marginTop: '150px' }}>
      {movieDetails.Title ? (
        <div style={{ display: 'flex', alignItems: 'stretch', maxWidth: '800px', width: '100%' }}>
          <img src={movieDetails.Poster} alt={movieDetails.Title} style={{ flexShrink: 0, height: 'auto', marginRight: '20px' }} />
          <div>
            <h2>{movieDetails.Title}</h2>
            <p>Year: {movieDetails.Year}</p>
            <p>Rated: {movieDetails.Rated}</p>
            <p>Metascore: {movieDetails.Metascore}/100</p>
            <p>imdb Rating: {movieDetails.imdbRating}/10</p>
            <p>Genre: {movieDetails.Genre}</p>
            <p>Director: {movieDetails.Director}</p>
            <p>Notable Actors: {movieDetails.Actors}</p>
            <p>Synopsis: {movieDetails.Plot}</p>
            <button onClick={addToWatchlist}>Add to Watchlist</button>
          </div>
        </div>
      ) : (
        <p>Loading movie details...</p>
      )}
      <div>
        <h2>Similar Movies</h2>
        {similarMovies.length > 0 ? (
          <ul>
            {similarMovies.map(movie => (
              <li key={movie.imdbID}>
                <Link to={`/movie-detail/${movie.imdbID}`}>{movie.Title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No similar movies.</p>
        )}
      </div>
    </div>
  );
  
};

export default MovieDetail;
