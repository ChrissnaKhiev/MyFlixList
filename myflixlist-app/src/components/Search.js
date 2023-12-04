import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    
    try {
      await onSearch(searchTerm);
    } catch (error) {
      console.error('Error fetching movies:', error.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <form onSubmit={handleSearch} style={{ textAlign: 'center' }}>
        <label>
          Search Movies:
          <input type="text" value={searchTerm} onChange={handleInputChange} />
        </label>
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
