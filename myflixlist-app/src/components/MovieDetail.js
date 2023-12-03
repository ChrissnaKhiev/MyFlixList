import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = ( user ) => {
  const [movieDetails, setMovieDetails] = useState({});
  const { title } = useParams();
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {

        const response = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&t=${title}`);
        if(response.data && response.data.Title) {
          setMovieDetails(response.data);
        } else {
          // Handle case where movie data is not as expected
          console.log('Movie data not found or invalid:', response.data);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [title]);

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
      console.log(response.data);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  };

  return (
    <div>
      {movieDetails.Title ? (
        <div>
          <h2>{movieDetails.Title}</h2>
          <button onClick={addToWatchlist}>Add to Watchlist</button>
          <img src={movieDetails.Poster} alt={movieDetails.title} style={{ width: '150px', height: '225px' }} />
          <p>Year: {movieDetails.Year}</p>
          <p>Rated: {movieDetails.Rated}</p>
          <p>Metascore: {movieDetails.Metascore}/100</p>
          <p>imdb Rating: {movieDetails.imdbRating}/10</p>
          <p>Genre: {movieDetails.Genre}</p>
          <p>Director: {movieDetails.Director}</p>
          <p>Notable Actors: {movieDetails.Actors}</p>
          <p>Synopsis: {movieDetails.Plot}</p>
        </div>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
  
};

export default MovieDetail;
