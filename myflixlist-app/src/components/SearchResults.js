import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';

const SearchResults = ({ movies, user, refreshWatchlist }) => {
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  const addToWatchlist = async (movie) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }

    try {
      const response = await axios.post('/add-to-watchlist', {
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        genre: movie.Genre,
        imdbID: movie.ImdbID
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });
      setMessage(`Added '${movie.Title}' to watchlist.`);
      setShowMessage(true);
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      setMessage(`Error adding movie to watchlist: ${error.message}`);
      setShowMessage(true);
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
      messageTimeoutRef.current = setTimeout(() => setShowMessage(false), 5000);
    }
    refreshWatchlist();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 className="mb-4">Search Results: </h1>
      {showMessage && <Alert variant="success">{message}</Alert>}
      <Row xs={1} md={3} lg={4} className="g-3"> 
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie.imdbID}>
              <Card className="h-100">
                <Card.Img variant="top" src={movie.Poster} alt={movie.Title} style={{ height: '225px', objectFit: 'cover' }} />
                <Card.Body>
                  <Card.Title>
                    <Link to={`/movie-detail/${movie.imdbID}`}>{movie.Title}</Link>
                  </Card.Title>
                  <Card.Text>
                    Year: {movie.Year}
                  </Card.Text>
                  <Button variant="outline-danger" onClick={() => addToWatchlist(movie)}>Add to Watchlist</Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No results found or search.</p>
        )}
      </Row>
    </div>
  );  
};

export default SearchResults;
