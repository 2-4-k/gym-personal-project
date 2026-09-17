import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExercises, logSession } from "../api";

function emptySet(exerciseId) {
  return { exercise_id: exerciseId, reps: "", weight: "", rpe: "" };
}

export default function LogWorkout() {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [sets, setSets] = useState([]);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExercises()
      .then((data) => {
        setExercises(data);
        if (data.length > 0) setSets([emptySet(data[0].id)]);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function updateSet(index, field, value) {
    setSets((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  }

  function addSet() {
    const lastExercise = sets[sets.length - 1]?.exercise_id ?? exercises[0]?.id;
    setSets((prev) => [...prev, emptySet(lastExercise)]);
  }

  function removeSet(index) {
    setSets((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (sets.length === 0) {
      setError("Add at least one set.");
      return;
    }

    const payload = {
      notes: notes || null,
      duration_minutes: duration === "" ? null : Number(duration),
      sets: sets.map((s) => ({
        exercise_id: Number(s.exercise_id),
        reps: Number(s.reps),
        weight: Number(s.weight),
        rpe: s.rpe === "" ? null : Number(s.rpe),
      })),
    };

    for (const s of payload.sets) {
      if (!s.exercise_id || !s.reps || s.weight === "" || Number.isNaN(s.weight)) {
        setError("Every set needs an exercise, reps, and weight.");
        return;
      }
    }

    setSubmitting(true);
    try {
      await logSession(payload);
      navigate("/history");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="app-shell"><p className="status-text">Loading...</p></div>;

  if (exercises.length === 0) {
    return (
      <div className="app-shell">
        <p className="status-text">No exercises yet. Add one on the Exercises page first.</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Log workout</h1>
      </header>

      <form onSubmit={handleSubmit} className="workout-form">
        {sets.map((s, i) => (
          <div className="set-row" key={i}>
            <select value={s.exercise_id} onChange={(e) => updateSet(i, "exercise_id", e.target.value)}>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Reps"
              min="1"
              value={s.reps}
              onChange={(e) => updateSet(i, "reps", e.target.value)}
            />
            <input
              type="number"
              placeholder="Weight"
              min="0"
              step="0.5"
              value={s.weight}
              onChange={(e) => updateSet(i, "weight", e.target.value)}
            />
            <input
              type="number"
              placeholder="RPE"
              min="1"
              max="10"
              value={s.rpe}
              onChange={(e) => updateSet(i, "rpe", e.target.value)}
            />
            <button
              type="button"
              className="remove-set"
              onClick={() => removeSet(i)}
              disabled={sets.length === 1}
              aria-label="Remove set"
            >
              &times;
            </button>
          </div>
        ))}

        <button type="button" className="add-set" onClick={addSet}>
          + Add set
        </button>

        <label className="notes-label">
          Duration (minutes)
          <input
            type="number"
            min="0"
            placeholder="Optional — estimated from set count if left blank"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </label>

        <label className="notes-label">
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save session"}
        </button>
      </form>
    </div>
  );
}
