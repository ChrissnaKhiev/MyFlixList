import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
    const location = useLocation();
    const isOnSearchPage = location.pathname === '/search';

  return (
    <nav style={{ backgroundColor: '#f0f0f0', padding: '10px', textAlign: 'right' }}>
      {user && <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>}
      <Link to="/search" style={{ marginRight: '10px' }}>Search</Link>
      {user && <button onClick={onLogout} style={{ marginRight: '10px' }}>Logout</button>}
      {!user && isOnSearchPage && (
                <Link to="/">
                    <button>Login</button>
                </Link>
            )}
    </nav>
  );
};

export default Navbar;
