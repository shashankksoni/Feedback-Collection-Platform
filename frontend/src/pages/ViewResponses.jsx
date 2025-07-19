import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';

// Helper for summary stats
function getSummaryStats(questions, responses) {
  return questions.map(q => {
    if (q.questionType === 'text') {
      return {
        ...q,
        answers: responses.map(resp =>
          (resp.answers.find(a => a.questionId === q._id)?.answerText || '')
        ).filter(Boolean)
      };
    } else if (q.questionType === 'multiple-choice') {
      const summary = {};
      q.options.forEach(opt => { summary[opt] = 0; });
      responses.forEach(resp => {
        const ans = resp.answers.find(a => a.questionId === q._id);
        if (ans && summary.hasOwnProperty(ans.answerText)) {
          summary[ans.answerText]++;
        }
      });
      return { ...q, summary };
    }
    return q;
  });
}

const ViewResponses = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null);
  const [summaryStats, setSummaryStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/responses/${formId}`, {
          headers: { 'x-auth-token': token },
        });
        setResponses(res.data);
        const formRes = await axios.get(`http://localhost:5000/api/forms`, {
          headers: { 'x-auth-token': token },
        });
        const currentForm = formRes.data.find(f => f._id === formId);
        setForm(currentForm);

        if (currentForm) {
          setSummaryStats(getSummaryStats(currentForm.questions, res.data));
        }
      } catch {
        setError('Failed to load responses');
      }
    };
    fetchData();
  }, [formId]);

  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/responses/export/${formId}`, {
        headers: { 'x-auth-token': token },
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${form.title}_responses.csv`);
    } catch {
      alert('Failed to export CSV');
    }
  };

  if (error) return <p style={{ textAlign: 'center', marginTop: 40 }}>{error}</p>;
  if (!form) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      background: '#fff',
      borderRadius: 14,
      boxShadow: '0 4px 24px 0 rgba(31,38,135,0.10)',
      padding: '2.5rem 2.2rem',
      minHeight: '80vh',
      marginTop: 36,
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* BACK BUTTON */}
      <button
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
          marginRight: 16
        }}
        onClick={() => navigate('/admin/dashboard')}
      >
        ← Back to Dashboard
      </button>
      <h2 style={{
        marginBottom: 14,
        color: '#23235b',
        letterSpacing: 1,
        fontWeight: 700,
        fontSize: 26
      }}>
        Responses for: {form.title}
      </h2>
      <button
        onClick={handleExportCSV}
        style={{
          background: '#2e7d32',
          color: 'white',
          border: 'none',
          borderRadius: 7,
          padding: '10px 20px',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          marginBottom: 34
        }}
      >
        Export CSV
      </button>

      {/* SUMMARY STATS */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 13, color: '#23235b' }}>
          Feedback Summary
        </h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 30,
        }}>
          {summaryStats.map((q, idx) => (
            <div
              key={idx}
              style={{
                background: "linear-gradient(135deg, #eef3fd 70%, #f9fbff 100%)",
                border: '1.5px solid #d3e0ff',
                boxShadow: '0 6px 32px 0 rgba(80,150,220,0.10), 0 1.5px 6px rgba(30,60,120,0.04)',
                borderRadius: 15,
                padding: '27px 21px',
                minWidth: 265,
                flex: 1,
                maxWidth: 360,
                marginBottom: 12,
                transition: 'box-shadow .22s, transform .22s',
                fontSize: 16
              }}
              onMouseOver={e => {
                e.currentTarget.style.boxShadow =
                  "0 10px 38px 0 rgba(60,100,180,0.19), 0 2px 10px rgba(30,60,120,0.08)";
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
              }}
              onMouseOut={e => {
                e.currentTarget.style.boxShadow =
                  "0 6px 32px 0 rgba(80,150,220,0.10), 0 1.5px 6px rgba(30,60,120,0.04)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{
                fontSize: 17,
                color: '#1b2a4e',
                fontWeight: 700,
                marginBottom: 13
              }}>{q.questionText}</div>
              {q.questionType === 'multiple-choice' ? (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {Object.entries(q.summary).map(([opt, count]) => (
                    <li key={opt} style={{
                      fontSize: 16,
                      marginBottom: 5,
                      color: '#2b3d5e'
                    }}>
                      <span style={{ fontWeight: 600 }}>{opt}:</span> <span style={{ fontWeight: 700, color: "#007bff" }}>{count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <strong>Total Responses:</strong> {q.answers.length}
                  <ul style={{
                    maxHeight: 70,
                    overflowY: 'auto',
                    paddingLeft: 15,
                    fontSize: 15,
                    color: '#5a5a65',
                    marginTop: 5,
                    marginBottom: 0
                  }}>
                    {q.answers.slice(0, 3).map((ans, i) => (
                      <li key={i}>"{ans}"</li>
                    ))}
                    {q.answers.length > 3 && (
                      <li style={{ color: '#888' }}>...and {q.answers.length - 3} more</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RAW RESPONSES TABLE */}
      <div style={{ overflowX: 'auto', marginTop: 15 }}>
        <h3 style={{
          fontSize: 21,
          fontWeight: 700,
          color: '#23235b',
          marginBottom: 18,
          marginTop: 18
        }}>All Raw Responses</h3>
        {responses.length === 0 ? (
          <p style={{ color: '#888', marginTop: 18 }}>No responses yet.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: '#fafbff',
            borderRadius: 8,
            boxShadow: '0 0 5px rgba(0,0,0,0.06)'
          }}>
            <thead>
              <tr style={{ background: '#f4f6fa' }}>
                <th style={{ padding: 12, borderBottom: '2px solid #e0e6f7', fontSize: 16, textAlign: 'left' }}>Submitted At</th>
                {form.questions.map(q => (
                  <th key={q._id} style={{ padding: 12, borderBottom: '2px solid #e0e6f7', fontSize: 16, textAlign: 'left' }}>{q.questionText}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((resp) => (
                <tr key={resp._id} style={{ background: '#fff', borderRadius: 7 }}>
                  <td style={{ padding: 10, borderBottom: '1px solid #eee', fontSize: 15 }}>
                    {new Date(resp.submittedAt).toLocaleString()}
                  </td>
                  {form.questions.map(q => {
                    const answer = resp.answers.find(a => a.questionId === q._id);
                    return (
                      <td key={q._id} style={{ padding: 10, borderBottom: '1px solid #eee', fontSize: 15 }}>
                        {answer ? answer.answerText : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ViewResponses;
