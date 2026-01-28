import React, { useEffect, useState } from "react";
import HabitCard from "./HabitCard";

function App() {
  const [backendMessage, setBackendMessage] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(response => response.json())
      .then(data => setBackendMessage(data.message))
      .catch(error => console.error("Error fetching backend:", error));
  }, []);

  return (
    <div>
      <h1>Habit Tracker UI</h1>
      <p>Backend says: {backendMessage}</p>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <HabitCard title="📚 Learn Programming" initialTime={2700} />
        <HabitCard title="🇩🇪 Learning German" initialTime={1500} />
        <HabitCard title="📻 Duolingo Spanish" initialTime={900} />
      </div>
    </div>
  );
}

export default App;
