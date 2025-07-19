import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminLogin() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const key = params.get('key');

  const [error, setError] = useState(null);

  useEffect(() => {
    if (key) {
      fetch(`http://localhost:3000/admin/login?key=${key}`, {
        method: 'GET',
        credentials: 'include'  // important if using sessions/cookies
      })
        .then(async res => {
          if (res.status === 200) {
            // Success: redirect to admin dashboard
            navigate('/admin/dashboard');
          } else if (res.status === 401) {
            // Unauthorized
            const data = await res.json();
            setError(data.message || 'Invalid key');
          } else {
            // Other errors
            setError('Login failed');
          }
        })
        .catch(() => {
          setError('Server error');
        });
    } else {
      setError('No key provided');
    }
  }, [key, navigate]);

  return (
    <div>
      <h2>Admin Login</h2>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>Checking key...</p>}
    </div>
  );
}

export default AdminLogin;
