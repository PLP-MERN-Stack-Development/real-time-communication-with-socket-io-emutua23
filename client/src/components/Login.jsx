import { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (username.length > 20) {
      setError('Username must be less than 20 characters');
      return;
    }

    onLogin(username.trim());
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <FaComments className="login-icon" />
          <h1>Real-Time Chat</h1>
          <p>Join the conversation</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Choose a username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter your username"
              autoFocus
              autoComplete="off"
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="login-button">
            Join Chat
          </button>
        </form>

        <div className="login-footer">
          <p>💬 Connect with people in real-time</p>
          <p>🔔 Get instant notifications</p>
          <p>🚀 Fast and secure</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
