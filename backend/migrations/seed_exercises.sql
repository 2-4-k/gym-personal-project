-- Starter exercises with muscle group mappings
-- intensity: 1.0 = primary mover, 0.5 = secondary/assisting muscle

INSERT INTO exercises (name, category) VALUES
    ('Bench Press', 'push'),
    ('Overhead Press', 'push'),
    ('Incline Dumbbell Press', 'push'),
    ('Tricep Pushdown', 'push'),
    ('Pull-Up', 'pull'),
    ('Barbell Row', 'pull'),
    ('Lat Pulldown', 'pull'),
    ('Bicep Curl', 'pull'),
    ('Back Squat', 'legs'),
    ('Deadlift', 'legs'),
    ('Romanian Deadlift', 'legs'),
    ('Leg Press', 'legs'),
    ('Calf Raise', 'legs'),
    ('Plank', 'core'),
    ('Hanging Leg Raise', 'core');

-- Bench Press: chest primary, shoulders + triceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Bench Press' AND m.name = 'Chest';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Bench Press' AND m.name = 'Shoulders';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Bench Press' AND m.name = 'Triceps';

-- Overhead Press: shoulders primary, triceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Overhead Press' AND m.name = 'Shoulders';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Overhead Press' AND m.name = 'Triceps';

-- Incline Dumbbell Press: chest primary, shoulders + triceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Incline Dumbbell Press' AND m.name = 'Chest';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Incline Dumbbell Press' AND m.name = 'Shoulders';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Incline Dumbbell Press' AND m.name = 'Triceps';

-- Tricep Pushdown: triceps primary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Tricep Pushdown' AND m.name = 'Triceps';

-- Pull-Up: back primary, biceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Pull-Up' AND m.name = 'Back';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Pull-Up' AND m.name = 'Biceps';

-- Barbell Row: back primary, biceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Barbell Row' AND m.name = 'Back';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Barbell Row' AND m.name = 'Biceps';

-- Lat Pulldown: back primary, biceps secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Lat Pulldown' AND m.name = 'Back';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Lat Pulldown' AND m.name = 'Biceps';

-- Bicep Curl: biceps primary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Bicep Curl' AND m.name = 'Biceps';

-- Back Squat: quads primary, glutes + hamstrings secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Back Squat' AND m.name = 'Quads';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Back Squat' AND m.name = 'Glutes';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Back Squat' AND m.name = 'Hamstrings';

-- Deadlift: back + hamstrings primary, glutes secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Deadlift' AND m.name = 'Back';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Deadlift' AND m.name = 'Hamstrings';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Deadlift' AND m.name = 'Glutes';

-- Romanian Deadlift: hamstrings primary, glutes secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Romanian Deadlift' AND m.name = 'Hamstrings';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Romanian Deadlift' AND m.name = 'Glutes';

-- Leg Press: quads primary, glutes secondary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Leg Press' AND m.name = 'Quads';
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 0.5 FROM exercises e, muscle_groups m WHERE e.name = 'Leg Press' AND m.name = 'Glutes';

-- Calf Raise: calves primary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Calf Raise' AND m.name = 'Calves';

-- Plank: core primary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Plank' AND m.name = 'Core';

-- Hanging Leg Raise: core primary
INSERT INTO exercise_muscle_groups (exercise_id, muscle_group_id, intensity)
SELECT e.id, m.id, 1.0 FROM exercises e, muscle_groups m WHERE e.name = 'Hanging Leg Raise' AND m.name = 'Core';