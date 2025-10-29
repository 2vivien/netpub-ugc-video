import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css'; // Assuming a CSS file for login specific styles

const Login: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/dashboard');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Dashboard Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
