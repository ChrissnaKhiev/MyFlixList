import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginHandler = ({ user, previousUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.username && (!previousUser || !previousUser.username)) {
      navigate('/search');
    }
  }, [user, previousUser, navigate]);

  return null;
};

export default LoginHandler;
