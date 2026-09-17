"""
Derived stats: calorie estimates, personal records, and training streaks.

Calorie estimate uses a standard MET (metabolic equivalent) formula for
resistance training, adjusted slightly by how hard the session felt (RPE):

    calories = MET * bodyweight_kg * duration_hours

When a session has no logged duration, we estimate one from the number of
sets (roughly 3.5 minutes per set, covering the lift and rest between sets).
"""

from datetime import datetime, timedelta

LBS_PER_KG = 2.20462
MET_BASE = 5.0
MET_PER_RPE_POINT = 0.3
MET_MIN = 3.0
MET_MAX = 8.0
DEFAULT_RPE = 6.0
MINUTES_PER_SET_ESTIMATE = 3.5


def estimate_session_calories(session, user):
    sets = session.sets
    if not sets:
        return 0.0

    duration_minutes = session.duration_minutes or (len(sets) * MINUTES_PER_SET_ESTIMATE)

    rpes = [s.rpe for s in sets if s.rpe is not None]
    avg_rpe = sum(rpes) / len(rpes) if rpes else DEFAULT_RPE
    met = max(MET_MIN, min(MET_MAX, MET_BASE + (avg_rpe - 5) * MET_PER_RPE_POINT))

    bodyweight_kg = user.bodyweight_lbs / LBS_PER_KG
    calories = met * bodyweight_kg * (duration_minutes / 60)
    return round(calories, 1)


def estimate_1rm(weight, reps):
    """Epley formula estimate of a one-rep max."""
    return weight * (1 + reps / 30)


def compute_streak(session_dates):
    """Consecutive calendar days (ending today or yesterday) with a session."""
    date_set = set(session_dates)
    if not date_set:
        return 0

    today = datetime.utcnow().date()
    cursor = today if today in date_set else today - timedelta(days=1)

    streak = 0
    while cursor in date_set:
        streak += 1
        cursor -= timedelta(days=1)
    return streak


def get_user_stats(user, sessions):
    today = datetime.utcnow().date()

    total_sessions = len(sessions)
    total_volume = sum(s.reps * s.weight for sess in sessions for s in sess.sets)
    total_calories = sum(estimate_session_calories(sess, user) for sess in sessions)
    calories_today = sum(
        estimate_session_calories(sess, user)
        for sess in sessions
        if sess.session_date.date() == today
    )
    streak = compute_streak(sess.session_date.date() for sess in sessions)

    return {
        "total_sessions": total_sessions,
        "total_volume_lbs": round(total_volume, 1),
        "total_calories_estimated": round(total_calories, 1),
        "calories_today": round(calories_today, 1),
        "current_streak_days": streak,
    }


def get_personal_records(sessions):
    by_exercise = {}
    for sess in sessions:
        for s in sess.sets:
            entry = by_exercise.setdefault(
                s.exercise_id,
                {
                    "exercise_id": s.exercise_id,
                    "exercise_name": s.exercise.name,
                    "best_weight": 0,
                    "best_estimated_1rm": 0,
                    "total_volume": 0,
                    "total_sets": 0,
                },
            )
            entry["best_weight"] = max(entry["best_weight"], s.weight)
            entry["best_estimated_1rm"] = max(
                entry["best_estimated_1rm"], round(estimate_1rm(s.weight, s.reps), 1)
            )
            entry["total_volume"] += s.reps * s.weight
            entry["total_sets"] += 1

    for entry in by_exercise.values():
        entry["total_volume"] = round(entry["total_volume"], 1)

    return sorted(by_exercise.values(), key=lambda e: e["exercise_name"])
