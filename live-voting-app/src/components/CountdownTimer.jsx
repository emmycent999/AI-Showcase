import { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(targetTime) - new Date();
    
    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      expired: false
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (timeLeft.expired) {
    return (
      <div className="countdown-expired">
        <div className="expired-badge">⏰</div>
        <h3>VOTING ENDED</h3>
        <p>Results are being calculated</p>
      </div>
    );
  }

  return (
    <div className="countdown-display">
      <div className="time-block">
        <span className="time-value">{timeLeft.hours.toString().padStart(2, '0')}</span>
        <span className="time-label">Hours</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-block">
        <span className="time-value">{timeLeft.minutes.toString().padStart(2, '0')}</span>
        <span className="time-label">Minutes</span>
      </div>
      <span className="time-separator">:</span>
      <div className="time-block">
        <span className="time-value">{timeLeft.seconds.toString().padStart(2, '0')}</span>
        <span className="time-label">Seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;