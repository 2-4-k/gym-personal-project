import { useState } from "react";
import { useAuth } from "../useAuth";

export default function Account() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(() => user?.name || "");
  const [bodyweight, setBodyweight] = useState(() => user?.bodyweight_lbs ?? "");
  const [heightFeet, setHeightFeet] = useState(() => Math.floor((user?.height_inches ?? 0) / 12));
  const [heightInches, setHeightInches] = useState(() => Math.round((user?.height_inches ?? 0) % 12));
  const [sex, setSex] = useState(() => user?.sex || "other");
  const [trainingExperience, setTrainingExperience] = useState(() => user?.training_experience || "intermediate");
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const totalHeightInches = Number(heightFeet || 0) * 12 + Number(heightInches || 0);

    setSubmitting(true);
    try {
      await updateProfile({
        name,
        bodyweight_lbs: Number(bodyweight),
        height_inches: totalHeightInches,
        sex,
        training_experience: trainingExperience,
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Account</h1>
      </header>

      <form onSubmit={handleSubmit} className="exercise-form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
        </label>
        <label>
          Email
          <input value={user.email} disabled />
        </label>

        <label>
          Bodyweight (lbs)
          <input
            type="number"
            min="50"
            max="700"
            value={bodyweight}
            onChange={(e) => setBodyweight(e.target.value)}
            required
          />
        </label>

        <div className="height-fields">
          <label>
            Height (ft)
            <input
              type="number"
              min="3"
              max="8"
              value={heightFeet}
              onChange={(e) => setHeightFeet(e.target.value)}
              required
            />
          </label>
          <label>
            Height (in)
            <input
              type="number"
              min="0"
              max="11"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Sex
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other / prefer not to say</option>
          </select>
        </label>

        <label>
          Training experience
          <select value={trainingExperience} onChange={(e) => setTrainingExperience(e.target.value)}>
            <option value="novice">Novice (&lt; 1 year)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="advanced">Advanced (3+ years)</option>
          </select>
        </label>

        {error && <p className="form-error">{error}</p>}
        {saved && <p className="form-success">Saved.</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}
