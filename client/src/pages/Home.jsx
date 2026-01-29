import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <h1>🤖 AI Showcase & Hackathon 2024</h1>
          <p>Innovation • Collaboration • Excellence</p>
        </div>

        <div className="card">
          <h2 style={{ color: '#1e40af', marginBottom: '20px' }}>About the Event</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#334155' }}>
            Join us for an exciting AI Showcase & Hackathon where innovators, developers, and AI enthusiasts 
            come together to build, learn, and showcase cutting-edge AI solutions.
          </p>
        </div>

        <div className="btn-group">
          <button className="btn btn-primary" onClick={() => navigate('/participant')}>
            Register as Participant
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/organiser')}>
            Register as Organizer
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/alumni')}>
            Register as Alumni
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/validate')}>
            Validate Registration
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/vote')}>
            Vote for Teams
          </button>
        </div>

        <div className="footer">
          <p>© 2024 AI Showcase & Hackathon. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
