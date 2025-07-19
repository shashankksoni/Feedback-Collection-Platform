import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PublicForm = () => {
  const { publicId } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/forms/${publicId}`);
        setForm(res.data);
        setAnswers(res.data.questions.map(() => ''));
      } catch {
        setError('Form not found');
      }
    };
    fetchForm();
  }, [publicId]);

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const responsePayload = answers.map((answer, index) => ({
        questionId: form.questions[index]._id,
        answerText: answer,
      }));

      await axios.post(`http://localhost:5000/api/responses/${publicId}`, {
        answers: responsePayload,
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSubmitted(true);
      }, 1500);
    } catch {
      setError('Failed to submit feedback');
    }
  };

  if (error) return <p style={{ textAlign: 'center', marginTop: 50 }}>{error}</p>;
  if (!form) return <p style={{ textAlign: 'center', marginTop: 50 }}>Loading...</p>;
  if (submitted) return <p style={{ textAlign: 'center', marginTop: 50, fontWeight: 600, fontSize: 22, color: '#1976d2' }}>Thank you for your feedback!</p>;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f7fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit}
        style={{
          background: 'white',
          borderRadius: 12,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
          padding: '2.5rem 2.2rem',
          maxWidth: 600,
          width: '100%',
          position: 'relative'
        }}>
        <h1 style={{
          marginBottom: 32,
          color: '#23235b',
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 1,
          textAlign: 'left'
        }}>
          {form.title}
        </h1>
        {form.questions.map((q, index) => (
          <div key={index} style={{ marginBottom: 30 }}>
            <label style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 18,
              color: '#333',
              fontWeight: 600
            }}>
              {q.questionText}
            </label>
            {q.questionType === 'text' ? (
              <input
                type="text"
                value={answers[index]}
                onChange={e => handleChange(index, e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  borderRadius: 6,
                  border: '1px solid #c8c8d8',
                  background: '#fafafd'
                }}
              />
            ) : (
              <select
                value={answers[index]}
                onChange={e => handleChange(index, e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 16,
                  borderRadius: 6,
                  border: '1px solid #c8c8d8',
                  background: '#fafafd'
                }}
              >
                <option value="">Select an option</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button
          type="submit"
          style={{
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 7,
            padding: '13px 0',
            fontSize: 18,
            fontWeight: 600,
            width: '100%',
            cursor: 'pointer',
            marginTop: 8,
            transition: 'background .2s'
          }}
        >
          Submit Feedback
        </button>
        {error && <div style={{ color: 'red', marginTop: 18 }}>{error}</div>}
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
            Feedback submitted!
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
      </form>
    </div>
  );
};

export default PublicForm;
