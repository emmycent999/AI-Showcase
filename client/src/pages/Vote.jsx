import React, { useState } from 'react';
import { API_BASE_URL } from '../config';

function Vote() {
  const [email, setEmail] = useState('');
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  const teams = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta', 'Team Epsilon'];

  const handleVote = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, team_name: teamName })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Vote submitted successfully!');
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('Vote submission failed');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>Vote for Your Favorite Team</h1>
        </div>
        <div className="card">
          {message && <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>{message}</div>}
          <form onSubmit={handleVote}>
            <div className="form-group">
              <label>Your Email *</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" />
            </div>
            <div className="form-group">
              <label>Select Team *</label>
              <select required value={teamName} onChange={(e) => setTeamName(e.target.value)}>
                <option value="">Choose a team</option>
                {teams.map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Submit Vote</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Vote;
