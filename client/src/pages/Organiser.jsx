import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Organiser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: '', email: '', role: '', phone: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'organizer' })
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
          <h1>Organizer Registration</h1>
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
              <label>Role *</label>
              <select required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                <option value="">Select Role</option>
                <option value="Judge">Judge</option>
                <option value="Mentor">Mentor</option>
                <option value="Organizer">Organizer</option>
                <option value="Volunteer">Volunteer</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Organiser;
