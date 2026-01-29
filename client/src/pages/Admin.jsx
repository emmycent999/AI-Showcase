import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

function Admin() {
  const [auth, setAuth] = useState({ email: '', password: '' });
  const [authenticated, setAuthenticated] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');

  const handleLogin = () => {
    if (auth.email && auth.password) {
      setAuthenticated(true);
      fetchRegistrations();
    }
  };

  const fetchRegistrations = async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.append('type', filter);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE_URL}/api/admin/registrations?${params}`, {
        headers: { email: auth.email, password: auth.password }
      });
      const data = await res.json();
      setRegistrations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (authenticated) fetchRegistrations();
  }, [filter, search]);

  if (!authenticated) {
    return (
      <div className="page">
        <div className="container">
          <div className="header">
            <h1>Admin Login</h1>
          </div>
          <div className="card">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={auth.email} onChange={(e) => setAuth({...auth, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={auth.password} onChange={(e) => setAuth({...auth, password: e.target.value})} />
            </div>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="card">
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">All Types</option>
              <option value="participant">Participants</option>
              <option value="organizer">Organizers</option>
              <option value="alumni">Alumni</option>
            </select>
            <input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map(reg => (
                <tr key={reg.id}>
                  <td>{reg.full_name}</td>
                  <td>{reg.email}</td>
                  <td>{reg.type}</td>
                  <td>{reg.role || reg.graduation_year || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Admin;
