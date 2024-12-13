import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/users'); // Redirect to Users page after successful login
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Management App</h1>
        <p style={styles.description}>Please log in to manage your tasks efficiently.</p>
        {!isAuthenticated && (
          <button
            style={styles.button}
            onClick={() =>
              loginWithRedirect({
                redirect_uri: window.location.origin + '/users',
              })
            }
          >
            Log In
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    marginBottom: '2rem',
    color: '#555',
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default HomePage;
