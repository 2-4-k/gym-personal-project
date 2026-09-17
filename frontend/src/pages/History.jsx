import { useEffect, useState } from "react";
import { getSessions } from "../api";

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSessions()
      .then((data) => {
        setSessions(data);
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
        <h1>History</h1>
      </header>

      {sessions.length === 0 ? (
        <p className="status-text">No sessions logged yet.</p>
      ) : (
        <div className="session-list">
          {sessions.map((s) => (
            <div className="session-card" key={s.id}>
              <div className="session-card-header">
                <div>
                  <p className="session-date">{formatDate(s.session_date)}</p>
                  {s.notes && <p className="session-notes">{s.notes}</p>}
                </div>
                <div className="session-meta">
                  {s.duration_minutes != null && <span className="pill muted">{s.duration_minutes} min</span>}
                  <span className="pill muted">~{s.calories_burned} kcal</span>
                </div>
              </div>
              <table className="set-table">
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Reps</th>
                    <th>Weight</th>
                    <th>RPE</th>
                  </tr>
                </thead>
                <tbody>
                  {s.sets.map((set, i) => (
                    <tr key={i}>
                      <td>{set.exercise_name}</td>
                      <td>{set.reps}</td>
                      <td>{set.weight}</td>
                      <td>{set.rpe ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
