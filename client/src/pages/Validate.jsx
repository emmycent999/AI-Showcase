import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

function Validate() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);

  const handleValidate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/validate?email=${email}`);
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Validation failed' });
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>Validate Registration</h1>
        </div>
        <div className="card">
          <form onSubmit={handleValidate}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" />
            </div>
            <button type="submit" className="btn btn-primary">Validate</button>
          </form>

          {result && (
            <div style={{ marginTop: '30px' }}>
              {result.registered ? (
                <div className="alert alert-success">
                  <h3>✓ Registration Confirmed</h3>
                  <p><strong>Name:</strong> {result.data.full_name}</p>
                  <p><strong>Type:</strong> {result.data.type}</p>
                  <p><strong>Email:</strong> {result.data.email}</p>
                </div>
              ) : (
                <div className="alert alert-error">
                  <h3>✗ Not Registered</h3>
                  <p>This email is not found in our records.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Validate;
