import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Container, Row, Col, Button, Alert } from 'react-bootstrap';

const MyList = ({ watchlist, user, refreshWatchlist }) => {
  const [detailedList, setDetailedList] = useState([]);
  const [message, setMessage] = useState('');

  const removeFromWatchlist = async (movieId) => {
    try {
      await axios.post('/remove-from-watchlist', { movieId }, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      refreshWatchlist();
      setMessage(`Removed movie from watchlist.`);
    } catch (error) {
      console.error('Error removing movie from watchlist:', error);
      setMessage(`Error removing movie from watchlist: ${error.message}`);
    }
  };
  

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      const fetchDetails = async () => {
        const detailedData = await Promise.all(
          watchlist.map(async (movie) => {
            const omdbResponse = await axios.get(
              `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&t=${movie.title}`
            );
            const omdbData = omdbResponse.data;
            return {
              ...movie,
              title: omdbData.Title,
              year: omdbData.Year,
              genre: omdbData.Genre,
              poster: omdbData.Poster,
              imdbID: omdbData.imdbID,
            };
          })
        );
        setDetailedList(detailedData);
      };

      fetchDetails();
    }
  }, [watchlist]);

  return (
    <Container>
      {message && <Alert variant="info">{message}</Alert>}
      <h1 className="text-center my-4">My List</h1>
      {detailedList && detailedList.length > 0 ? (
        <Row xs={2} md={3} lg={4} className="g-3">
          {detailedList.map((movie, index) => (
            <Col key={index}>
              <Card className="h-100">
                <Link to={`/movie-detail/${movie.imdbID}`}>
                  <Card.Img variant="top" src={movie.poster} alt={movie.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </Link>
                <Card.Body>
                  <Card.Title>
                    <Link to={`/movie-detail/${movie.imdbID}`}>{movie.title} ({movie.year})</Link>
                  </Card.Title>
                  <Button variant="danger" onClick={() => removeFromWatchlist(movie._id)}>Remove from Watchlist</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No movies in watchlist.</p>
      )}
    </Container>
  );
};

export default MyList;