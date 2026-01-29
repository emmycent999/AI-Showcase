import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Alumni() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', graduation_year: '', institution: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'alumni' })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>Alumni Registration</h1>
        </div>
        <div className="card">
          {message && <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Graduation Year *</label>
              <input type="number" required value={formData.graduation_year} onChange={(e) => setFormData({...formData, graduation_year: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Institution *</label>
              <input required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Alumni;
