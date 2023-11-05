import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyList = ({ token }) => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        // Fetch user's watchlist
        const response = await axios.get('/watchlist', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.data || response.data.length === 0) {
          console.log('User has no items in the watchlist');
          return;
        }

        // Fetch detailed movie information for each movie in the watchlist
        const detailedMyList = await Promise.all(
          response.data.map(async (movie) => {
            // Assuming your watchlist items have a title property
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

        setMyList(detailedMyList);
      } catch (error) {
        console.error('Error fetching MyList:', error);
      }
    };

    fetchMyList();
  }, [token]);

  return (
    <div>
      <h1>MyList</h1>
      <ul>
        {myList.map((movie, index) => (
          <li key={index}>
            <img src={movie.poster} alt={movie.Title} style={{ width: '150px', height: '225px' }} />
            <p>
              {movie.title} ({movie.year}) - Genre: {movie.genre}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;
