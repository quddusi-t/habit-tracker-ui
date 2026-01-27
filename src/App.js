import React from 'react';
import HabitCard from './HabitCard';

function App() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <HabitCard title="📚 Learn Programming" initialTime={2700} />
      <HabitCard title="🇩🇪 Learning German" initialTime={1500} />
      <HabitCard title="📻 Duolingo Spanish" initialTime={900} />
    </div>
  );
}

export default App;
