from app import db
from datetime import datetime


class MuscleGroup(db.Model):
    __tablename__ = "muscle_groups"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    base_recovery_hours = db.Column(db.Integer, nullable=False, default=48)
    reference_volume = db.Column(db.Float, nullable=False, default=1000)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "base_recovery_hours": self.base_recovery_hours,
            "reference_volume": self.reference_volume,
        }


class Exercise(db.Model):
    __tablename__ = "exercises"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50))

    muscle_groups = db.relationship(
        "ExerciseMuscleGroup", backref="exercise", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "muscle_groups": [
                {"muscle_group_id": mg.muscle_group_id, "intensity": mg.intensity}
                for mg in self.muscle_groups
            ],
        }


class ExerciseMuscleGroup(db.Model):
    __tablename__ = "exercise_muscle_groups"

    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.id"), primary_key=True)
    muscle_group_id = db.Column(db.Integer, db.ForeignKey("muscle_groups.id"), primary_key=True)
    intensity = db.Column(db.Float, nullable=False, default=1.0)


class WorkoutSession(db.Model):
    __tablename__ = "workout_sessions"

    id = db.Column(db.Integer, primary_key=True)
    session_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    notes = db.Column(db.Text)

    sets = db.relationship("WorkoutSet", backref="session", cascade="all, delete-orphan")


class WorkoutSet(db.Model):
    __tablename__ = "workout_sets"

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey("workout_sessions.id"), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey("exercises.id"), nullable=False)
    reps = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    rpe = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    exercise = db.relationship("Exercise")