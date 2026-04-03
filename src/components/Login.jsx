import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = React.memo(({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Specific credentials provided by the user
    const VALID_EMAIL = 'patidarrigal6@gmail.com';
    const VALID_PASSWORD = '123patidar098';

    setTimeout(() => {
      if (email === VALID_EMAIL && password === VALID_PASSWORD) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-wrapper mesh-gradient">
      <div className="login-glow"></div>
      <div className="login-container">
        <div className="login-header">
          <div className="logo-icon-wrapper">
            <LogIn size={32} strokeWidth={2.5} />
          </div>
          <h1>Expense Pro</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500 }}>
            Enter your credentials to access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Username / Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                className="input"
                placeholder="patidarrigal6@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                className="input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Admin Panel • Secure Gateway</p>
        </div>
      </div>
    </div>
  );
});

export default Login;
