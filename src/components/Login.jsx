import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, LogIn, AlertCircle, ShieldCheck, Mail, ArrowRight, Timer, RefreshCcw, Key, Plus } from 'lucide-react';

const Login = React.memo(({ onLoginSuccess, initialResetMode = false, onQuickAdd }) => {
  const [mode, setMode] = useState(initialResetMode ? 'reset' : 'login'); // 'login', 'master', 'reset'
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const pinRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // Predefined Master Safety Key (ADMIN ONLY)
  const MASTER_SAFETY_KEY = 'PATIDAR@99-RESET';
  
  // Default PIN if none exists: 123456
  const DEFAULT_PIN_HASH = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'; 

  const hashPin = async (val) => {
    const msgUint8 = new TextEncoder().encode(val);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  useEffect(() => {
    if (mode === 'login' || mode === 'reset') pinRefs[0].current?.focus();
    
    if (!localStorage.getItem('expensePro_pinHash')) {
      localStorage.setItem('expensePro_pinHash', DEFAULT_PIN_HASH);
    }
  }, [mode]);

  const handlePinChange = async (index, value) => {
    if (isNaN(value)) return;
    const newPin = [...pin];
    newPin[index] = value.substring(value.length - 1);
    setPin(newPin);

    if (value && index < 5) {
      pinRefs[index + 1].current.focus();
    }

    if (newPin.every(digit => digit !== '')) {
      if (mode === 'login') handleLoginSubmit(newPin.join(''));
      else if (mode === 'reset') handleResetSubmit(newPin.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current.focus();
    }
  };

  const handleLoginSubmit = async (enteredPin) => {
    setError('');
    setLoading(true);
    try {
      const hashedEnteredPin = await hashPin(enteredPin);
      const storedHash = localStorage.getItem('expensePro_pinHash');

      setTimeout(() => {
        if (hashedEnteredPin === storedHash) {
          onLoginSuccess();
        } else {
          setError('Invalid PIN. Please try again.');
          setPin(['', '', '', '', '', '']);
          pinRefs[0].current?.focus();
        }
        setLoading(false);
      }, 600);
    } catch (err) {
      setError('An error occurred.');
      setLoading(false);
    }
  };

  const handleResetSubmit = async (newPinValue) => {
    setError('');
    setLoading(true);
    try {
      const hashedNewPin = await hashPin(newPinValue);
      localStorage.setItem('expensePro_pinHash', hashedNewPin);
      setMessage('PIN successfully reset! Login to continue.');
      setMode('login');
      setPin(['', '', '', '', '', '']);
      setLoading(false);
    } catch (err) {
      setError('Failed to reset PIN.');
      setLoading(false);
    }
  };

  const handleMasterKeySubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    setTimeout(() => {
      if (masterKeyInput === MASTER_SAFETY_KEY) {
        setMode('reset');
        setMessage('Master Key verified! Set your new PIN.');
        setMasterKeyInput('');
      } else {
        setError('Incorrect Master Safety Key. Access denied.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="login-wrapper mesh-gradient">
      <div className="login-glow"></div>
      <div className="login-container">

        <div className="login-header">
          <div className="logo-icon-wrapper" style={{ marginBottom: '1.5rem' }}>
            {mode === 'login' && <Lock size={48} strokeWidth={2} />}
            {mode === 'master' && <Key size={48} strokeWidth={2} style={{ color: '#d946ef' }} />}
            {mode === 'reset' && <ShieldCheck size={48} strokeWidth={2} />}
          </div>
          <h1>
            {mode === 'login' && 'Enter PIN'}
            {mode === 'master' && 'Owner Verification'}
            {mode === 'reset' && 'Create New PIN'}
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.5rem' }}>
            {mode === 'login' && 'Dashboard is locked. Enter your 6-digit PIN.'}
            {mode === 'master' && 'Please enter your Master Safety Key to reset.'}
            {mode === 'reset' && 'Create a new 6-digit secure PIN for your dashboard.'}
          </p>
        </div>

        <div className="login-form">
          {error && (
            <div className="login-error" style={{ justifyContent: 'center' }}>
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="reset-badge" style={{ backgroundColor: 'rgba(124, 58, 237, 0.1)', color: '#a78bfa', borderColor: 'rgba(124, 58, 237, 0.2)', width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '1.5rem' }}>
              <ShieldCheck size={18} />
              <span>{message}</span>
            </div>
          )}

          {mode === 'master' ? (
            <form onSubmit={handleMasterKeySubmit}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <input
                  autoFocus
                  type="password"
                  value={masterKeyInput}
                  onChange={(e) => setMasterKeyInput(e.target.value)}
                  placeholder="Enter Master Safety Key"
                  className="input"
                  style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '2px', fontWeight: 'bold' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary login-btn" 
                disabled={loading || !masterKeyInput}
              >
                {loading ? 'Verifying...' : 'Unlock System'}
              </button>
              <button 
                type="button" 
                className="forgot-pin-btn"
                onClick={() => setMode('login')}
                style={{ marginTop: '1rem' }}
              >
                Back to Login
              </button>
            </form>
          ) : (
            <div className="pin-input-container">
              {pin.map((digit, idx) => (
                <input
                  key={idx}
                  ref={pinRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`pin-box ${digit ? 'filled' : ''}`}
                  disabled={loading}
                  autoComplete="off"
                />
              ))}
            </div>
          )}

          {mode === 'login' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button 
                type="button" 
                className="forgot-pin-btn"
                onClick={() => setMode('master')}
                disabled={loading}
                style={{ marginBottom: '1.5rem' }}
              >
                Forgot PIN? (Use Master Key)
              </button>
              <div className="quick-access-banner" style={{ width: '100%' }}>
                 <button 
                    className="btn-quick-add"
                    onClick={onQuickAdd}
                 >
                    <Plus size={20} strokeWidth={3} />
                    <span>Quick Add Expense</span>
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>© 2026 Admin Panel • Master Verification System</p>
        </div>
      </div>
    </div>
  );
});

export default Login;


