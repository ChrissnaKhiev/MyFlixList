import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyList = ({ watchlist }) => {
  const [detailedList, setDetailedList] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const detailedData = await Promise.all(
        watchlist.map(async (movie) => {
          const omdbResponse = await axios.get(
            `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDBKEY}&t=${movie.title}`
          );
          const omdbData = omdbResponse.data;
          return {
            title: omdbData.Title,
            year: omdbData.Year,
            genre: omdbData.Genre,
            poster: omdbData.Poster,
          };
        })
      );
      setDetailedList(detailedData);
    };

    if (watchlist.length > 0) {
      fetchDetails();
    }
  }, [watchlist]);

  return (
    <div>
      <h1>MyList</h1>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', overflowX: 'auto' }}>
        {detailedList.map((movie, index) => (
          <li key={index} style={{ marginRight: '20px' }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '150px', height: '225px' }} />
            <p>{movie.title} ({movie.year}) - Genre: {movie.genre}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;