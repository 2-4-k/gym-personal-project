import { useEffect, useState } from "react";
import { getMuscleStatus, getStats } from "../api";
import { useAuth } from "../useAuth";
import MuscleIcon from "../components/MuscleIcon";

function MuscleCard({ muscle }) {
  const statusClass = muscle.ready ? "ready" : "recovering";
  const statusText = muscle.ready ? "Ready now" : `${Math.round(muscle.hours_remaining)}h remaining`;

  return (
    <div className={`muscle-card ${statusClass}`}>
      <MuscleIcon muscleName={muscle.name} ready={muscle.ready} />
      <div>
        <p className="muscle-name">{muscle.name}</p>
        <p className="muscle-status">{statusText}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [muscles, setMuscles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getMuscleStatus(), getStats()])
      .then(([muscleData, statsData]) => {
        setMuscles(muscleData);
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const readyMuscles = muscles.filter((m) => m.ready);
  const displayName = user?.name || user?.email;

  if (loading) return <div className="app-shell"><p className="status-text">Loading...</p></div>;
  if (error) return <div className="app-shell"><p className="status-text error">Couldn't reach the server. Is the Flask backend running?</p></div>;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Welcome back{displayName ? `, ${displayName}` : ""}</h1>
          <p className="subtitle">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
      </header>

      {stats && (
        <section className="stats-row">
          <div className="stat-tile">
            <p className="stat-value">{stats.current_streak_days}</p>
            <p className="stat-label">Day streak</p>
          </div>
          <div className="stat-tile">
            <p className="stat-value">{stats.total_sessions}</p>
            <p className="stat-label">Sessions logged</p>
          </div>
          <div className="stat-tile">
            <p className="stat-value">{stats.total_volume_lbs.toLocaleString()}</p>
            <p className="stat-label">Total volume (lbs)</p>
          </div>
          <div className="stat-tile">
            <p className="stat-value">{stats.calories_today.toLocaleString()}</p>
            <p className="stat-label">Calories today</p>
          </div>
          <div className="stat-tile">
            <p className="stat-value">{stats.total_calories_estimated.toLocaleString()}</p>
            <p className="stat-label">Calories, all time</p>
          </div>
        </section>
      )}

      <section className="ready-banner">
        <p className="ready-label">Ready to train today</p>
        <div className="ready-pills">
          {readyMuscles.length === 0 ? (
            <span className="pill muted">Nothing fully rested yet</span>
          ) : (
            readyMuscles.map((m) => (
              <span key={m.muscle_group_id} className="pill">{m.name}</span>
            ))
          )}
        </div>
      </section>

      <section>
        <p className="section-label">All muscle groups</p>
        <div className="muscle-grid">
          {muscles.map((m) => (
            <MuscleCard key={m.muscle_group_id} muscle={m} />
          ))}
        </div>
      </section>
    </div>
  );
}
