import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MIN_QUESTIONS = 3;
const MAX_QUESTIONS = 5;
const MAX_TITLE = 100;
const MAX_QUESTION = 200;
const MAX_OPTION = 80;

const CreateForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { questionText: '', questionType: '', options: [] },
    { questionText: '', questionType: '', options: [] },
    { questionText: '', questionType: '', options: [] }
  ]);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'questionText') {
      value = value.slice(0, MAX_QUESTION); // enforce max
    }
    newQuestions[index][field] = value;
    if (field === 'questionType' && value === 'text') {
      newQuestions[index].options = [];
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value.slice(0, MAX_OPTION); // enforce max
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(optIndex, 1);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    if (questions.length < MAX_QUESTIONS) {
      setQuestions([...questions, { questionText: '', questionType: '', options: [] }]);
    }
  };

  const removeQuestion = (index) => {
    if (questions.length > MIN_QUESTIONS) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Trim all fields before validation and submission
    const trimmedTitle = title.trim().slice(0, MAX_TITLE);
    const trimmedQuestions = questions.map(q => ({
      ...q,
      questionText: q.questionText.trim().slice(0, MAX_QUESTION),
      options: q.options.map(opt => opt.trim().slice(0, MAX_OPTION)),
    }));

    if (trimmedQuestions.length < MIN_QUESTIONS || trimmedQuestions.length > MAX_QUESTIONS) {
      setError(`Number of questions must be between ${MIN_QUESTIONS} and ${MAX_QUESTIONS}`);
      return;
    }
    for (const q of trimmedQuestions) {
      if (!q.questionText) {
        setError('All questions must have text');
        return;
      }
      if (!q.questionType) {
        setError('Please select question type for every question');
        return;
      }
      if (q.questionType === 'multiple-choice' && q.options.length < 2) {
        setError('Multiple choice questions must have at least 2 options');
        return;
      }
      if (q.questionType === 'multiple-choice' && q.options.some(opt => !opt)) {
        setError('All options must have text');
        return;
      }
    }
    if (!trimmedTitle) {
      setError('Form title is required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/forms', {
        title: trimmedTitle,
        questions: trimmedQuestions
      }, {
        headers: { 'x-auth-token': token },
      });
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError('Failed to create form');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      background: '#f6f6f8',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      <div style={{
        marginTop: 35,
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 6px 24px 0 rgba(31,38,135,0.11)',
        padding: '2rem 2.2rem',
        maxWidth: 900,
        width: '100%',
        position: 'relative'
      }}>
        <button
          onClick={() => navigate('/admin/dashboard')}
          style={{
            marginBottom: 18,
            padding: '8px 18px',
            background: '#23235b',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            position: 'absolute',
            left: 30,
            top: 24,
            zIndex: 2
          }}
        >
          ← Back to Dashboard
        </button>

        <h2 style={{
          marginBottom: 26,
          color: '#23235b',
          letterSpacing: 1,
          fontWeight: 700,
          textAlign: 'left',
          marginLeft: 0,
          marginTop: 72,
          position: 'relative'
        }}>Create Feedback Form</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <input
            type="text"
            placeholder="Form Title"
            value={title}
            onChange={e => setTitle(e.target.value.slice(0, MAX_TITLE))}
            required
            maxLength={MAX_TITLE}
            style={{
              padding: 13,
              fontSize: 16,
              borderRadius: 8,
              border: '1px solid #bbb',
              width: '100%',
              marginBottom: 8,
              fontFamily: 'inherit'
            }}
          />
          <div style={{fontSize: 13, color: "#767686", marginBottom: 7, marginTop: -15}}>
            Max {MAX_TITLE} characters.
          </div>

          {questions.map((q, index) => (
            <div key={index}
              style={{
                border: '1.5px solid #e2e7f5',
                borderRadius: 11,
                background: index % 2 === 0 ? "#f8fbff" : "#f4f5fa",
                boxShadow: '0 2px 18px 0 rgba(31,38,135,0.04)',
                marginBottom: 22,
                padding: '22px 15px 18px 15px',
                position: 'relative',
                transition: 'background .3s'
              }}
            >
              <div style={{
                borderLeft: '3px solid #1976d2',
                paddingLeft: 11,
                marginBottom: 15,
                fontWeight: 700,
                color: '#2e2e3a',
                fontSize: 17
              }}>
                Question {index + 1}
              </div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 10 }}>
                <div style={{ flex: 2, minWidth: 230 }}>
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={q.questionText}
                    onChange={e => handleQuestionChange(index, 'questionText', e.target.value)}
                    required
                    maxLength={MAX_QUESTION}
                    style={{
                      padding: 11,
                      fontSize: 15,
                      borderRadius: 6,
                      border: '1px solid #bdbdbd',
                      width: '100%',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{fontSize: 12, color: "#888", marginTop: 2}}>
                    Max {MAX_QUESTION} characters.
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 140 }}>
                  <select
                    value={q.questionType}
                    onChange={e => handleQuestionChange(index, 'questionType', e.target.value)}
                    required
                    style={{
                      padding: 10,
                      fontSize: 15,
                      borderRadius: 6,
                      border: '1px solid #bdbdbd',
                      width: '100%',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="" disabled>Choose Option</option>
                    <option value="text">Text</option>
                    <option value="multiple-choice">Multiple Choice</option>
                  </select>
                </div>
                {questions.length > MIN_QUESTIONS && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    style={{
                      background: '#fff0f0',
                      color: '#c0392b',
                      border: '1px solid #fadede',
                      borderRadius: 5,
                      padding: '7px 18px',
                      fontWeight: 600,
                      height: 39,
                      alignSelf: 'center',
                      cursor: 'pointer',
                      marginLeft: 10,
                    }}
                    title="Remove this question"
                  >Remove</button>
                )}
              </div>
              {q.questionType === 'multiple-choice' && (
                <div style={{ width: '100%', marginTop: 8 }}>
                  <label style={{ fontSize: 14, fontWeight: 500, color: '#1a233b', marginBottom: 2 }}>Options:</label>
                  {q.options.map((opt, i) => (
                    <div key={i} style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 6 }}>
                      <input
                        type="text"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={e => handleOptionChange(index, i, e.target.value)}
                        required
                        maxLength={MAX_OPTION}
                        style={{
                          padding: 10,
                          fontSize: 14,
                          borderRadius: 5,
                          border: '1px solid #c5c5c5',
                          fontFamily: 'inherit',
                          flex: 1
                        }}
                      />
                      <span style={{fontSize: 11, color: "#aaa", marginLeft: 3}}>{MAX_OPTION - opt.length} left</span>
                      <button
                        type="button"
                        onClick={() => removeOption(index, i)}
                        style={{
                          background: '#ffeaea',
                          color: '#c0392b',
                          border: '1px solid #fadede',
                          borderRadius: 4,
                          padding: '6px 10px',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                        title="Remove this option"
                      >Remove</button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(index)}
                    style={{
                      background: '#eef6fa',
                      color: '#007bff',
                      border: '1px solid #bee3f7',
                      borderRadius: 5,
                      padding: '7px 14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: 14,
                      marginTop: 7
                    }}
                  >Add Option</button>
                </div>
              )}
              {index !== questions.length - 1 && (
                <div style={{
                  height: 1,
                  background: '#e2e7f5',
                  width: '100%',
                  margin: '24px 0 0 0'
                }}></div>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', gap: 20, marginTop: 6 }}>
            {questions.length < MAX_QUESTIONS && (
              <button
                type="button"
                onClick={addQuestion}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 7,
                  padding: '12px 24px',
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: 'pointer'
                }}
              >Add Question</button>
            )}
            <button
              type="submit"
              style={{
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: 7,
                padding: '12px 24px',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >Create Form</button>
          </div>
          {error && <div style={{ color: 'red', marginTop: 10 }}>{error}</div>}
        </form>
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
            Form created successfully!
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

export default CreateForm;
