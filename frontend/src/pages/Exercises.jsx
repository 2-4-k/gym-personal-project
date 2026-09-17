import { useEffect, useState } from "react";
import { createExercise, getExercises, getMuscleGroups } from "../api";

function emptyMapping(muscleGroupId) {
  return { muscle_group_id: muscleGroupId, intensity: 1.0 };
}

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [mappings, setMappings] = useState([]);
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function loadExercises() {
    return getExercises().then(setExercises);
  }

  useEffect(() => {
    Promise.all([getExercises(), getMuscleGroups()])
      .then(([ex, groups]) => {
        setExercises(ex);
        setMuscleGroups(groups);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function addMapping() {
    const used = new Set(mappings.map((m) => m.muscle_group_id));
    const next = muscleGroups.find((g) => !used.has(g.id));
    if (next) setMappings((prev) => [...prev, emptyMapping(next.id)]);
  }

  function updateMapping(index, field, value) {
    setMappings((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function removeMapping(index) {
    setMappings((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await createExercise({
        name: name.trim(),
        category: category.trim() || null,
        muscle_groups: mappings.map((m) => ({
          muscle_group_id: Number(m.muscle_group_id),
          intensity: Number(m.intensity),
        })),
      });
      setName("");
      setCategory("");
      setMappings([]);
      await loadExercises();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="app-shell"><p className="status-text">Loading...</p></div>;
  if (error) return <div className="app-shell"><p className="status-text error">{error}</p></div>;

  const groupName = (id) => muscleGroups.find((g) => g.id === Number(id))?.name ?? "?";

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Exercises</h1>
      </header>

      <section>
        <p className="section-label">All exercises</p>
        <div className="exercise-list">
          {exercises.map((ex) => (
            <div className="exercise-card" key={ex.id}>
              <div className="exercise-card-header">
                <p className="exercise-name">{ex.name}</p>
                {ex.category && <span className="pill muted">{ex.category}</span>}
              </div>
              <div className="exercise-muscles">
                {ex.muscle_groups.map((mg) => (
                  <span key={mg.muscle_group_id} className="pill">
                    {groupName(mg.muscle_group_id)} · {mg.intensity}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="section-label">Add exercise</p>
        <form onSubmit={handleSubmit} className="exercise-form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Category
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="push, pull, legs..."
            />
          </label>

          <p className="section-label">Muscle groups worked</p>
          {mappings.map((m, i) => (
            <div className="mapping-row" key={i}>
              <select
                value={m.muscle_group_id}
                onChange={(e) => updateMapping(i, "muscle_group_id", e.target.value)}
              >
                {muscleGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <select value={m.intensity} onChange={(e) => updateMapping(i, "intensity", e.target.value)}>
                <option value={1.0}>Primary</option>
                <option value={0.5}>Secondary</option>
              </select>
              <button type="button" className="remove-set" onClick={() => removeMapping(i)} aria-label="Remove">
                &times;
              </button>
            </div>
          ))}
          <button type="button" className="add-set" onClick={addMapping} disabled={mappings.length >= muscleGroups.length}>
            + Add muscle group
          </button>

          {formError && <p className="form-error">{formError}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Add exercise"}
          </button>
        </form>
      </section>
    </div>
  );
}
