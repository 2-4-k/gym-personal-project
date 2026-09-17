import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../useAuth";
import ThemeToggle from "../components/ThemeToggle";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bodyweight, setBodyweight] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [sex, setSex] = useState("other");
  const [trainingExperience, setTrainingExperience] = useState("intermediate");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const totalHeightInches = Number(heightFeet || 0) * 12 + Number(heightInches || 0);

    setSubmitting(true);
    try {
      await signup(email, password, {
        bodyweight_lbs: Number(bodyweight),
        height_inches: totalHeightInches,
        sex,
        training_experience: trainingExperience,
      });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <ThemeToggle />
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create account</h1>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
        </label>

        <p className="form-hint">
          Used to personalize recovery estimates to your body — a given lift means different relative
          effort for different bodyweights.
        </p>

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
        <button type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
