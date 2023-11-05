import React, { useState, useEffect } from 'react';

const MyList = ({ token, searchTerm }) => {
  const [myList, setMyList] = useState([]);
  const OMDBKEY = process.env.REACT_APP_OMDBKEY;

  useEffect(() => {
    const fetchMyList = async () => {
      try {
        const response = await fetch('http://localhost:3000/MyList', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching MyList');
        }

        const data = await response.json();

        // Fetch detailed movie information for each movie in the MyList
        const detailedMyList = await Promise.all(
          data.map(async (movie) => {
            const omdbResponse = await fetch(
              `http://www.omdbapi.com/?t=${movie.title}&apikey=${OMDBKEY}`
            );
            const omdbData = await omdbResponse.json();
            return {
              title: omdbData.Title,
              year: omdbData.Year,
              genre: omdbData.Genre,
            };
          })
        );

        setMyList(detailedMyList);
      } catch (error) {
        console.error('Error fetching MyList:', error);
      }
    };

    fetchMyList();
  }, [token, OMDBKEY, searchTerm]);

  return (
    <div>
      <h1>MyList</h1>
      <ul>
        {myList.map((movie, index) => (
          <li key={index}>
            {movie.title} ({movie.year}) - Genre: {movie.genre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyList;
