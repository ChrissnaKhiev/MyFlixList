import React, { useState } from 'react';
import { Form, Button, FormControl, Row, Col } from 'react-bootstrap';

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
    <div className="d-flex justify-content-center align-items-center" style={{ height: '20vh', marginTop: '100px' }}>
      <Form onSubmit={handleSearch} className="w-100 text-center">
        <Row className="align-items-center justify-content-center mb-2">
          <Col>
            <Form.Label className="text-danger" style={{ fontSize: '1.5em' }}>Search Movies:</Form.Label>
          </Col>
        </Row>
        <Row className="justify-content-center mb-2">
          <Col md={6}>
            <FormControl type="text" placeholder="Enter movie title" value={searchTerm} onChange={handleInputChange} />
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6}>
            <Button variant="danger" type="submit" className="w-100">Search</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Search;
