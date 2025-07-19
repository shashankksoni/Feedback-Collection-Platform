import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
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
      await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f6f6f8',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.16)',
        padding: '2.5rem 2rem',
        maxWidth: 450,
        width: '100%',
        position: 'relative'
      }}>
        <h2 style={{
          marginBottom: 30,
          color: '#23235b',
          letterSpacing: 1,
          fontWeight: 700,
          textAlign: 'center'
        }}>Admin Registration</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          maxWidth: 400,
          margin: '0 auto'
        }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: 14,
              fontSize: 14,
              borderRadius: 8,
              border: '1px solid #ccc',
              width: '100%',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ position: 'relative', marginBottom: 2 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                padding: '15px 50px 15px 15px',
                fontSize: 14,
                borderRadius: 8,
                border: '1px solid #bdbdbd',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                fontWeight: 500,
                letterSpacing: 0.5
              }}
            />
            {password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#1976d2',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: 12,
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.87,
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
              background: '#43a047',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              padding: '13px 0',
              fontSize: 16,
              fontWeight: 700,
              width: '100%',
              cursor: 'pointer',
              transition: 'background .2s',
              fontFamily: 'inherit'
            }}
          >Register</button>
        </form>
        {error && <div style={{ color: 'red', marginTop: 14 }}>{error}</div>}
        <p style={{ marginTop: 22, fontSize: 16, textAlign: 'center' }}>
          Already have an account?{' '}
          <a href="/admin/login" style={{ color: "#007bff", textDecoration: 'underline' }}>Login</a>
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
            Registration successful!
          </div>
        )}
        <style>
          {`
            @keyframes fadeToast {
              from { opacity: 0; bottom: 20px;}
              to   { opacity: 1; bottom: 50px;}
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default AdminRegister;
