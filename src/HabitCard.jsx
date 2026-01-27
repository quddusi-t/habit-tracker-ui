import React, { useState } from 'react';

function HabitCard({ title, initialTime }) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleDiscard = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <div style={styles.card}>
      <h3>{title}</h3>
      <p>{isRunning ? `⏱️ ${formatTime(timeLeft)} (running...)` : `⏱️ Idle`}</p>
      <div style={styles.buttons}>
        {!isRunning && <button onClick={handleStart}>START</button>}
        {isRunning && (
          <>
            <button onClick={handleStop}>STOP</button>
            <button onClick={handleDiscard}>DISCARD</button>
          </>
        )}
      </div>
    </div>
  );
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    margin: '1rem',
    borderRadius: '8px',
    width: '250px',
    backgroundColor: '#f9f9f9',
  },
  buttons: {
    display: 'flex',
    gap: '0.5rem',
  },
};

export default HabitCard;
