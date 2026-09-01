-- Gym Recovery Tracker schema

CREATE TABLE muscle_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    base_recovery_hours INT NOT NULL DEFAULT 48,
    reference_volume FLOAT NOT NULL DEFAULT 1000  -- typical hard-session volume (reps x weight)
);

CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50)  -- e.g. 'push', 'pull', 'legs'
);

CREATE TABLE exercise_muscle_groups (
    exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    muscle_group_id INT NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
    intensity FLOAT NOT NULL DEFAULT 1.0,  -- 1.0 = primary, 0.5 = secondary
    PRIMARY KEY (exercise_id, muscle_group_id)
);

CREATE TABLE workout_sessions (
    id SERIAL PRIMARY KEY,
    session_date TIMESTAMP NOT NULL DEFAULT NOW(),
    notes TEXT
);

CREATE TABLE workout_sets (
    id SERIAL PRIMARY KEY,
    session_id INT NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
    exercise_id INT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    reps INT NOT NULL,
    weight FLOAT NOT NULL,
    rpe INT CHECK (rpe BETWEEN 1 AND 10),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO muscle_groups (name, base_recovery_hours, reference_volume) VALUES
    ('Chest', 48, 3000),
    ('Back', 48, 3500),
    ('Shoulders', 48, 2000),
    ('Biceps', 36, 1200),
    ('Triceps', 36, 1500),
    ('Quads', 60, 4000),
    ('Hamstrings', 60, 3000),
    ('Glutes', 60, 3500),
    ('Calves', 24, 1500),
    ('Core', 24, 1000);