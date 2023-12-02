import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
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

  return (
    <div>
      {movieDetails.Title ? (
        <div>
          <h2>{movieDetails.Title}</h2>
          <img src={movieDetails.Poster} alt={movieDetails.title} style={{ width: '150px', height: '225px' }} />
          <p>Year: {movieDetails.Year}</p>
          <p>Director: {movieDetails.Director}</p>
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
