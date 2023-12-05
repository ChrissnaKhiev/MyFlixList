import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';

const NavbarComponent = ({ user, onLogout }) => {
    const location = useLocation();
    const isOnSearchPage = location.pathname === '/search';

    return (
      <Navbar bg="danger" variant="dark" expand="lg" className="mb-4" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <Navbar.Brand href="/" className="ms-3">My Flix List</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {user && <Nav.Link href="/" className="text-white">Dashboard</Nav.Link>}
                    <Nav.Link href="/search" className="text-white">Search</Nav.Link>
                </Nav>
                <Nav>
                    {user ? (
                        <Button variant="outline-light" onClick={onLogout} className="me-3" style={{ marginRight: '20px' }}>Logout</Button>
                    ) : (
                        isOnSearchPage && <Link to="/"><Button variant="outline-light" style={{ marginRight: '20px' }}>Login</Button></Link>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;
