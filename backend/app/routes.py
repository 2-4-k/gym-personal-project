"""
Volume-weighted muscle recovery calculation.

For each muscle group, find the most recent workout sets that hit it,
compute a fatigue score from volume x intensity, and use that to scale
the recovery window up or down from the muscle's base recovery time.
"""

from datetime import datetime
from app.models import MuscleGroup, WorkoutSet, ExerciseMuscleGroup, WorkoutSession
from app import db

MIN_MULTIPLIER = 0.5
MAX_MULTIPLIER = 2.0


def get_muscle_group_status(muscle_group: MuscleGroup):
    """
    Returns a dict describing whether this muscle group is ready to train,
    and how many hours remain until it is.
    """
    recent_sets = (
        db.session.query(WorkoutSet, ExerciseMuscleGroup, WorkoutSession)
        .join(ExerciseMuscleGroup, WorkoutSet.exercise_id == ExerciseMuscleGroup.exercise_id)
        .join(WorkoutSession, WorkoutSet.session_id == WorkoutSession.id)
        .filter(ExerciseMuscleGroup.muscle_group_id == muscle_group.id)
        .order_by(WorkoutSession.session_date.desc())
        .all()
    )

    if not recent_sets:
        return {
            "muscle_group_id": muscle_group.id,
            "name": muscle_group.name,
            "ready": True,
            "hours_remaining": 0,
            "last_trained": None,
        }

    latest_session_date = recent_sets[0][2].session_date
    same_session_sets = [
        (ws, emg) for ws, emg, sess in recent_sets if sess.session_date == latest_session_date
    ]

    fatigue = sum(ws.reps * ws.weight * emg.intensity for ws, emg in same_session_sets)

    multiplier = fatigue / muscle_group.reference_volume if muscle_group.reference_volume else 1.0
    multiplier = max(MIN_MULTIPLIER, min(MAX_MULTIPLIER, multiplier))

    recovery_hours_needed = muscle_group.base_recovery_hours * multiplier

    hours_since = (datetime.utcnow() - latest_session_date).total_seconds() / 3600
    hours_remaining = max(0, recovery_hours_needed - hours_since)

    return {
        "muscle_group_id": muscle_group.id,
        "name": muscle_group.name,
        "ready": hours_remaining <= 0,
        "hours_remaining": round(hours_remaining, 1),
        "last_trained": latest_session_date.isoformat(),
    }


def get_all_muscle_status():
    groups = MuscleGroup.query.all()
    return [get_muscle_group_status(g) for g in groups]