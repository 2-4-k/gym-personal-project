"""
Volume-weighted muscle recovery calculation.

For each muscle group, find the most recent workout sets that hit it,
compute a fatigue score from volume x intensity, and use that to scale
the recovery window up or down from the muscle's base recovery time.

The fatigue score is compared against a reference volume that's scaled
to the user's bodyweight, since the same absolute load (e.g. a 150lb
bench press) represents very different relative effort for a 130lb
lifter versus a 210lb lifter. Sex and training experience apply modest
further adjustments to the recovery window based on typical differences
in fatigue resistance and adaptation.
"""

from datetime import datetime
from app.models import MuscleGroup, WorkoutSet, ExerciseMuscleGroup, WorkoutSession, User
from app import db

MIN_MULTIPLIER = 0.5
MAX_MULTIPLIER = 2.0

# Bodyweight the muscle_groups.reference_volume values were calibrated against.
BASELINE_BODYWEIGHT_LBS = 170.0

# Modest adjustments to the recovery window, not the fatigue score itself.
SEX_RECOVERY_FACTOR = {"male": 1.0, "female": 0.9, "other": 1.0}
EXPERIENCE_RECOVERY_FACTOR = {"novice": 1.2, "intermediate": 1.0, "advanced": 0.85}


def get_muscle_group_status(muscle_group: MuscleGroup, user: User):
    """
    Returns a dict describing whether this muscle group is ready to train,
    and how many hours remain until it is.
    """
    recent_sets = (
        db.session.query(WorkoutSet, ExerciseMuscleGroup, WorkoutSession)
        .join(ExerciseMuscleGroup, WorkoutSet.exercise_id == ExerciseMuscleGroup.exercise_id)
        .join(WorkoutSession, WorkoutSet.session_id == WorkoutSession.id)
        .filter(ExerciseMuscleGroup.muscle_group_id == muscle_group.id)
        .filter(WorkoutSession.user_id == user.id)
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

    bodyweight_ratio = (user.bodyweight_lbs or BASELINE_BODYWEIGHT_LBS) / BASELINE_BODYWEIGHT_LBS
    adjusted_reference_volume = muscle_group.reference_volume * bodyweight_ratio

    multiplier = fatigue / adjusted_reference_volume if adjusted_reference_volume else 1.0
    multiplier = max(MIN_MULTIPLIER, min(MAX_MULTIPLIER, multiplier))

    sex_factor = SEX_RECOVERY_FACTOR.get(user.sex, 1.0)
    experience_factor = EXPERIENCE_RECOVERY_FACTOR.get(user.training_experience, 1.0)

    recovery_hours_needed = muscle_group.base_recovery_hours * multiplier * sex_factor * experience_factor

    hours_since = (datetime.utcnow() - latest_session_date).total_seconds() / 3600
    hours_remaining = max(0, recovery_hours_needed - hours_since)

    return {
        "muscle_group_id": muscle_group.id,
        "name": muscle_group.name,
        "ready": hours_remaining <= 0,
        "hours_remaining": round(hours_remaining, 1),
        "last_trained": latest_session_date.isoformat(),
    }


def get_all_muscle_status(user: User):
    groups = MuscleGroup.query.all()
    return [get_muscle_group_status(g, user) for g in groups]
