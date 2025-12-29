import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function NotFound() {
  const navigate = useNavigate();
  const { dark } = useContext(AuthContext);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className={`not-found-page ${dark ? 'dark' : ''}`}>
      <div className="page-shapes">
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
        <div className="page-shape"></div>
      </div>
      
      <div className="container">
        <div className="not-found-content">
          <div className="not-found-icon">🔍</div>
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>
            The page you're looking for doesn't exist or has been moved. 
            Don't worry, let's get you back on track!
          </p>
          
          <div className="not-found-actions">
            <button className="btn btn-primary" onClick={handleGoHome}>
              🏠 Go Home
            </button>
            <button className="btn btn-secondary" onClick={handleGoDashboard}>
              📊 Dashboard
            </button>
            <button className="btn btn-secondary" onClick={handleGoBack}>
              ← Go Back
            </button>
          </div>

          <div className="not-found-suggestions">
            <h3>Popular Pages:</h3>
            <div className="suggestion-links">
              <button className="suggestion-link" onClick={() => navigate('/dashboard')}>
                📊 Dashboard
              </button>
              <button className="suggestion-link" onClick={() => navigate('/profile')}>
                👤 Profile
              </button>
              <button className="suggestion-link" onClick={() => navigate('/create-opportunity')}>
                ➕ Create Opportunity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}