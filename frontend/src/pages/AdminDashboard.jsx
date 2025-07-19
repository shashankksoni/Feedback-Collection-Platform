import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchForms = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/forms', {
          headers: { 'x-auth-token': token },
        });
        setForms(res.data);
      } catch (err) {
        setError('Failed to fetch forms');
      }
    };
    fetchForms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f6f6f8',
      padding: 0,
    }}>
      {/* Floating Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: 24,
          right: 36,
          background: '#ef5350',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          padding: '9px 22px',
          fontSize: 15,
          fontWeight: 600,
          boxShadow: '0 2px 16px rgba(31,38,135,0.07)',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        Logout
      </button>
      
      {/* Main Card */}
      <div style={{
        margin: 'auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        padding: '2.5rem 2.2rem',
        minWidth: 320,
        maxWidth: 650,
        marginTop: 60,
        marginBottom: 40,
        position: 'relative'
      }}>
        {/* Brand Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: 28,
        }}>
          <span style={{
            color: '#1565c0',
            fontWeight: 900,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            Admin Dashboard
          </span>
        </div>

        <Link to="/admin/create-form">
          <button style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: 17,
            marginBottom: 24,
            width: '100%',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)'
          }}>
            + Create New Form
          </button>
        </Link>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div>
          {forms.length === 0 ? (
            <p style={{ color: '#888', marginTop: 40, textAlign: 'center' }}>No forms created yet.</p>
          ) : (
            <ul style={{ padding: 0 }}>
              {forms.map(form => (
                <li key={form._id} style={{
                  background: '#f7faff',
                  borderRadius: 10,
                  marginBottom: 18,
                  boxShadow: '0 1px 4px 0 rgba(0,0,0,0.05)',
                  padding: 18,
                  listStyle: 'none',
                  border: '1px solid #e5e8f1'
                }}>
                  <h3 style={{ marginBottom: 7, fontWeight: 700, color: '#2e2e3a' }}>{form.title}</h3>
                  <p style={{ fontSize: 14, marginBottom: 10, color: '#444' }}>
                    Public URL:&nbsp;
                    <a href={`/form/${form.publicId}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ color: '#1565c0', wordBreak: 'break-all' }}>
                      {window.location.origin}/form/{form.publicId}
                    </a>
                  </p>
                  <Link to={`/admin/responses/${form._id}`}>
                    <button style={{
                      background: '#43a047',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '9px 17px',
                      fontWeight: 600,
                      fontSize: 15,
                      marginRight: 10,
                      marginTop: 2
                    }}>
                      View Responses
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
