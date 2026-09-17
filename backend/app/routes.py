from flask import Blueprint, g, jsonify, request
from app import db
from app.auth import login_required
from app.models import Exercise, ExerciseMuscleGroup, MuscleGroup, WorkoutSession, WorkoutSet
from app.recovery import get_all_muscle_status
from app.stats import estimate_session_calories, get_personal_records, get_user_stats

bp = Blueprint("api", __name__)


@bp.route("/muscle-status", methods=["GET"])
@login_required
def muscle_status():
    return jsonify(get_all_muscle_status(g.current_user))


@bp.route("/exercises", methods=["GET"])
@login_required
def list_exercises():
    exercises = Exercise.query.order_by(Exercise.name).all()
    return jsonify([e.to_dict() for e in exercises])


@bp.route("/exercises", methods=["POST"])
@login_required
def create_exercise():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip() or None
    muscle_groups = data.get("muscle_groups", [])

    if not name:
        return jsonify({"error": "Exercise name is required"}), 400
    if Exercise.query.filter_by(name=name).first() is not None:
        return jsonify({"error": "An exercise with that name already exists"}), 409

    exercise = Exercise(name=name, category=category)
    db.session.add(exercise)
    db.session.flush()

    for mg in muscle_groups:
        db.session.add(
            ExerciseMuscleGroup(
                exercise_id=exercise.id,
                muscle_group_id=mg["muscle_group_id"],
                intensity=mg.get("intensity", 1.0),
            )
        )

    db.session.commit()
    return jsonify(exercise.to_dict()), 201


@bp.route("/muscle-groups", methods=["GET"])
@login_required
def list_muscle_groups():
    groups = MuscleGroup.query.all()
    return jsonify([group.to_dict() for group in groups])


@bp.route("/sessions", methods=["POST"])
@login_required
def log_session():
    data = request.get_json(silent=True) or {}
    sets = data.get("sets", [])

    if not sets:
        return jsonify({"error": "At least one set is required"}), 400

    session = WorkoutSession(
        user_id=g.current_user.id,
        notes=data.get("notes"),
        duration_minutes=data.get("duration_minutes"),
    )
    db.session.add(session)
    db.session.flush()

    for s in sets:
        workout_set = WorkoutSet(
            session_id=session.id,
            exercise_id=s["exercise_id"],
            reps=s["reps"],
            weight=s["weight"],
            rpe=s.get("rpe"),
        )
        db.session.add(workout_set)

    db.session.commit()
    return jsonify({"id": session.id}), 201


@bp.route("/sessions", methods=["GET"])
@login_required
def list_sessions():
    sessions = (
        WorkoutSession.query.filter_by(user_id=g.current_user.id)
        .order_by(WorkoutSession.session_date.desc())
        .all()
    )
    return jsonify(
        [
            {
                "id": s.id,
                "session_date": s.session_date.isoformat(),
                "notes": s.notes,
                "duration_minutes": s.duration_minutes,
                "calories_burned": estimate_session_calories(s, g.current_user),
                "sets": [
                    {
                        "exercise_id": ws.exercise_id,
                        "exercise_name": ws.exercise.name,
                        "reps": ws.reps,
                        "weight": ws.weight,
                        "rpe": ws.rpe,
                    }
                    for ws in s.sets
                ],
            }
            for s in sessions
        ]
    )


@bp.route("/stats", methods=["GET"])
@login_required
def stats():
    sessions = WorkoutSession.query.filter_by(user_id=g.current_user.id).all()
    return jsonify(get_user_stats(g.current_user, sessions))


@bp.route("/progress", methods=["GET"])
@login_required
def progress():
    sessions = WorkoutSession.query.filter_by(user_id=g.current_user.id).all()
    return jsonify(get_personal_records(sessions))
