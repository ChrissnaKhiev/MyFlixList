import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, ListGroup, Container, Row, Col, Image, Alert } from 'react-bootstrap';

const MovieDetail = ({ user }) => {
  const [movieDetails, setMovieDetails] = useState({});
  const [similarMovies, setSimilarMovies] = useState([]);
  const [message, setMessage] = useState('');
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
      setMessage(`Added '${movieDetails.Title}' to watchlist.`);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      setMessage(`Error adding movie to watchlist: ${error.message}`);
    }
  };

  return (
    <Container style={{ marginTop: '100px' }}>
      {movieDetails.Title ? (
        <Row>
          <Col md={4}>
            <Card>
              <Card.Img variant="top" src={movieDetails.Poster} alt={movieDetails.Title} />
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Card.Title>{movieDetails.Title}</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>Year: {movieDetails.Year}</ListGroup.Item>
                  <ListGroup.Item>Rated: {movieDetails.Rated}</ListGroup.Item>
                  <ListGroup.Item>Metascore: {movieDetails.Metascore}/100</ListGroup.Item>
                  <ListGroup.Item>IMDb Rating: {movieDetails.imdbRating}/10</ListGroup.Item>
                  <ListGroup.Item>Genre: {movieDetails.Genre}</ListGroup.Item>
                  <ListGroup.Item>Director: {movieDetails.Director}</ListGroup.Item>
                  <ListGroup.Item>Actors: {movieDetails.Actors}</ListGroup.Item>
                  <ListGroup.Item>{movieDetails.Plot}</ListGroup.Item>
                </ListGroup>
                <Button variant="danger" onClick={addToWatchlist}>Add to Watchlist</Button>
                {message && <Alert variant="success" style={{ marginTop: '10px'}}>{message}</Alert>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ) : (
        <p>Loading movie details...</p>
      )}
      <h2 className="mt-4 text-center">Similar Movies:</h2>
      {similarMovies.length > 0 ? (
        <Row xs={2} md={3} lg={4} xl={5} className="g-3">
          {similarMovies.map(movie => (
            <Col key={movie.imdbID}>
              <Card className="h-100">
                <Link to={`/movie-detail/${movie.imdbID}`}>
                  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px', padding: '10px' }}>
                    <Image src={movie.Poster} alt={movie.Title} className="rounded" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                  </div>
                </Link>
                <Card.Body>
                  <Card.Title className="text-center">
                    <Link to={`/movie-detail/${movie.imdbID}`}>{movie.Title}</Link>
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p>No similar movies found.</p>
      )}
    </Container>
  );
  
};

export default MovieDetail;
