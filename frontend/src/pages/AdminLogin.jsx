import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(130deg,#f7f8fd 60%,#e9f3fe 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif',
      flexDirection: 'column'
    }}>
      {/* Project Name */}
      <div style={{
        textAlign: 'center',
        marginBottom: 20,
        marginTop: -40
      }}>
        <span style={{
          fontSize: 34,
          color: '#1366d6',
          fontWeight: 900,
          letterSpacing: 2,
          fontFamily: 'inherit',
          textShadow: '0 2px 14px #e1ecff',
          textTransform: 'uppercase'
        }}>
          Feedback Collection Platform
        </span>
      </div>
      <div style={{
        background: 'white',
        borderRadius: 22,
        boxShadow: '0 10px 44px 0 rgba(31,38,135,0.17)',
        padding: '2.7rem 2.3rem 2.2rem 2.3rem',
        maxWidth: 430,
        width: '100%',
        animation: 'fadein 0.9s',
        position: 'relative'
      }}>
        <h2 style={{
          marginBottom: 26,
          color: '#23235b',
          letterSpacing: 1,
          fontWeight: 800,
          textAlign: 'center',
          fontSize: 32
        }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxWidth: 400,
          margin: '0 auto'
        }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoFocus
              onChange={e => setEmail(e.target.value.trim())}
              required
              maxLength={60}
              style={{
                padding: '15px 15px 15px 45px',
                fontSize: 16,
                borderRadius: 10,
                border: '1.5px solid #c3cde5',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                background: '#fafbff',
                transition: 'border .2s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7da8e5',
              fontSize: 18
            }}>📧</span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value.trim())}
              required
              maxLength={32}
              style={{
                padding: '15px 45px 15px 45px',
                fontSize: 16,
                borderRadius: 10,
                border: '1.5px solid #c3cde5',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                background: '#fafbff',
                letterSpacing: 0.5,
                transition: 'border .2s'
              }}
            />
            <span style={{
              position: 'absolute',
              left: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7da8e5',
              fontSize: 19
            }}>🔒</span>
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: 13,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: 14,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.92,
                  letterSpacing: 0.2
                }}
                tabIndex={0}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(90deg,#0478fd 50%,#3e8eff 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 9,
              padding: '14px 0',
              fontSize: 19,
              fontWeight: 700,
              width: '100%',
              cursor: 'pointer',
              marginTop: 8,
              boxShadow: '0 2px 10px #d8ebff88',
              transition: 'background .22s, box-shadow .22s'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg,#0259bb 30%,#258dff 100%)'}
            onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg,#0478fd 50%,#3e8eff 100%)'}
          >Login</button>
        </form>
        {error && <div style={{ color: '#ff1744', marginTop: 18, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        <p style={{ marginTop: 27, fontSize: 16, textAlign: 'center' }}>
          Don&apos;t have an account?{' '}
          <a href="/admin/register" style={{ color: "#1976d2", textDecoration: 'underline', fontWeight: 600 }}>Register</a>
        </p>
        {/* Success Toast */}
        {showSuccess && (
          <div style={{
            position: 'fixed',
            left: '50%',
            bottom: 50,
            transform: 'translateX(-50%)',
            background: '#2e7d32',
            color: 'white',
            padding: '16px 28px',
            borderRadius: 28,
            boxShadow: '0 4px 22px #1abc9c33',
            fontWeight: 600,
            fontSize: 18,
            zIndex: 9999,
            animation: 'fadeToast 1.2s'
          }}>
            Login successful!
          </div>
        )}
      </div>
      <style>
        {`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(35px) scale(0.98);}
          to { opacity: 1; transform: none;}
        }
        @keyframes fadeToast {
          from { opacity: 0; bottom: 20px;}
          to   { opacity: 1; bottom: 50px;}
        }
        `}
      </style>
    </div>
  );
};

export default AdminLogin;
