import { useEffect, useState } from "react";
import { getProgress } from "../api";

export default function Progress() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProgress()
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="app-shell"><p className="status-text">Loading...</p></div>;
  if (error) return <div className="app-shell"><p className="status-text error">{error}</p></div>;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Progress</h1>
        <p className="subtitle">Personal records, per exercise</p>
      </header>

      {records.length === 0 ? (
        <p className="status-text">Log a workout to start tracking records.</p>
      ) : (
        <div className="exercise-list">
          {records.map((r) => (
            <div className="exercise-card" key={r.exercise_id}>
              <div className="exercise-card-header">
                <p className="exercise-name">{r.exercise_name}</p>
              </div>
              <div className="record-grid">
                <div>
                  <p className="record-label">Best weight</p>
                  <p className="record-value">{r.best_weight} lbs</p>
                </div>
                <div>
                  <p className="record-label">Est. 1RM</p>
                  <p className="record-value">{r.best_estimated_1rm} lbs</p>
                </div>
                <div>
                  <p className="record-label">Total volume</p>
                  <p className="record-value">{r.total_volume.toLocaleString()} lbs</p>
                </div>
                <div>
                  <p className="record-label">Sets logged</p>
                  <p className="record-value">{r.total_sets}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
