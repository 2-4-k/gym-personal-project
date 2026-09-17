"""
Reference data (muscle groups + starter exercises) needed for the app to be
usable on a fresh database. Runs at app startup; it's a no-op once the
muscle_groups table has any rows, so it's safe to call on every boot.
"""

from sqlalchemy.exc import IntegrityError

from app import db
from app.models import Exercise, ExerciseMuscleGroup, MuscleGroup

DEFAULT_MUSCLE_GROUPS = [
    ("Chest", 48, 3000),
    ("Back", 48, 3500),
    ("Shoulders", 48, 2000),
    ("Biceps", 36, 1200),
    ("Triceps", 36, 1500),
    ("Quads", 60, 4000),
    ("Hamstrings", 60, 3000),
    ("Glutes", 60, 3500),
    ("Calves", 24, 1500),
    ("Core", 24, 1000),
]

# (name, category, [(muscle_group_name, intensity), ...])
DEFAULT_EXERCISES = [
    ("Bench Press", "push", [("Chest", 1.0), ("Shoulders", 0.5), ("Triceps", 0.5)]),
    ("Overhead Press", "push", [("Shoulders", 1.0), ("Triceps", 0.5)]),
    ("Incline Dumbbell Press", "push", [("Chest", 1.0), ("Shoulders", 0.5), ("Triceps", 0.5)]),
    ("Tricep Pushdown", "push", [("Triceps", 1.0)]),
    ("Pull-Up", "pull", [("Back", 1.0), ("Biceps", 0.5)]),
    ("Barbell Row", "pull", [("Back", 1.0), ("Biceps", 0.5)]),
    ("Lat Pulldown", "pull", [("Back", 1.0), ("Biceps", 0.5)]),
    ("Bicep Curl", "pull", [("Biceps", 1.0)]),
    ("Back Squat", "legs", [("Quads", 1.0), ("Glutes", 0.5), ("Hamstrings", 0.5)]),
    ("Deadlift", "legs", [("Back", 1.0), ("Hamstrings", 1.0), ("Glutes", 0.5)]),
    ("Romanian Deadlift", "legs", [("Hamstrings", 1.0), ("Glutes", 0.5)]),
    ("Leg Press", "legs", [("Quads", 1.0), ("Glutes", 0.5)]),
    ("Calf Raise", "legs", [("Calves", 1.0)]),
    ("Plank", "core", [("Core", 1.0)]),
    ("Hanging Leg Raise", "core", [("Core", 1.0)]),
]


def seed_reference_data():
    if MuscleGroup.query.first() is not None:
        return

    try:
        groups_by_name = {}
        for name, hours, volume in DEFAULT_MUSCLE_GROUPS:
            group = MuscleGroup(name=name, base_recovery_hours=hours, reference_volume=volume)
            db.session.add(group)
            groups_by_name[name] = group
        db.session.flush()

        for name, category, mappings in DEFAULT_EXERCISES:
            exercise = Exercise(name=name, category=category)
            db.session.add(exercise)
            db.session.flush()
            for group_name, intensity in mappings:
                db.session.add(
                    ExerciseMuscleGroup(
                        exercise_id=exercise.id,
                        muscle_group_id=groups_by_name[group_name].id,
                        intensity=intensity,
                    )
                )

        db.session.commit()
    except IntegrityError:
        db.session.rollback()
