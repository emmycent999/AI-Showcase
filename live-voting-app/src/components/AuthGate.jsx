import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGate = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus !== 'true') {
      navigate('/');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    return (
      <div className="auth-gate">
        <div className="auth-loading">
          <h2>🔒 Admin Access Required</h2>
          <p>Redirecting to voting page...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthGate;