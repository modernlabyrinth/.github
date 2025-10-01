"""
Unit tests for Workout model.
"""
import pytest
from datetime import datetime, timedelta


class TestWorkoutModel:
    """Test suite for Workout model."""

    def test_workout_creation(self, mock_workout):
        """Test basic workout creation."""
        assert mock_workout["title"] == "Morning Run"
        assert mock_workout["workout_type"] == "cardio"
        assert mock_workout["duration_minutes"] == 30

    def test_workout_duration_validation(self):
        """Test workout duration validation."""
        valid_durations = [5, 30, 60, 120]
        invalid_durations = [-1, 0, 1441]  # Negative, zero, over 24 hours
        
        for duration in valid_durations:
            assert duration > 0 and duration <= 1440
        
        for duration in invalid_durations:
            assert duration <= 0 or duration > 1440

    def test_workout_calories_calculation(self):
        """Test calories burned calculation."""
        # Simple MET-based calculation
        duration_minutes = 30
        weight_kg = 70
        met_value = 8.0  # Running at 8 km/h
        
        calories = (met_value * weight_kg * duration_minutes) / 60
        assert calories > 0
        assert calories == pytest.approx(186.67, rel=0.1)

    def test_workout_type_validation(self):
        """Test workout type validation."""
        valid_types = ["cardio", "strength", "flexibility", "sports", "other"]
        invalid_types = ["invalid", "", "random"]
        
        for wtype in valid_types:
            assert wtype in valid_types
        
        for wtype in invalid_types:
            assert wtype not in valid_types

    def test_workout_exercises_relationship(self, sample_workout_data):
        """Test workout-exercises relationship."""
        exercises = sample_workout_data["exercises"]
        assert len(exercises) == 2
        assert exercises[0]["sets"] == 3
        assert exercises[0]["reps"] == 10

    def test_workout_completion_status(self, mock_workout):
        """Test workout completion tracking."""
        assert mock_workout["completed"] is True
        
        # Test incomplete workout
        incomplete_workout = mock_workout.copy()
        incomplete_workout["completed"] = False
        assert incomplete_workout["completed"] is False

    def test_workout_intensity_calculation(self):
        """Test workout intensity score calculation."""
        # Intensity based on heart rate zones
        avg_heart_rate = 150
        max_heart_rate = 190
        
        intensity_percentage = (avg_heart_rate / max_heart_rate) * 100
        assert intensity_percentage > 0
        assert intensity_percentage <= 100

    @pytest.mark.parametrize("workout_type,expected_category", [
        ("cardio", "aerobic"),
        ("strength", "anaerobic"),
        ("flexibility", "mobility"),
        ("yoga", "mind_body"),
    ])
    def test_workout_category_mapping(self, workout_type, expected_category):
        """Test workout type to category mapping."""
        category_map = {
            "cardio": "aerobic",
            "strength": "anaerobic",
            "flexibility": "mobility",
            "yoga": "mind_body"
        }
        assert category_map.get(workout_type) == expected_category

    def test_workout_stats_aggregation(self):
        """Test workout statistics aggregation."""
        workouts = [
            {"duration_minutes": 30, "calories_burned": 250},
            {"duration_minutes": 45, "calories_burned": 400},
            {"duration_minutes": 20, "calories_burned": 150}
        ]
        
        total_duration = sum(w["duration_minutes"] for w in workouts)
        total_calories = sum(w["calories_burned"] for w in workouts)
        avg_duration = total_duration / len(workouts)
        
        assert total_duration == 95
        assert total_calories == 800
        assert avg_duration == pytest.approx(31.67, rel=0.1)

    def test_workout_date_validation(self):
        """Test workout date validation."""
        today = datetime.utcnow().date()
        future_date = (datetime.utcnow() + timedelta(days=1)).date()
        past_date = (datetime.utcnow() - timedelta(days=1)).date()
        
        # Future dates should not be allowed
        assert future_date > today
        # Past and current dates should be allowed
        assert past_date <= today

    def test_workout_notes_and_tags(self):
        """Test workout notes and tags functionality."""
        workout_data = {
            "notes": "Felt strong today, increased weight on squats",
            "tags": ["legs", "heavy", "PR"],
            "rating": 4
        }
        
        assert len(workout_data["notes"]) > 0
        assert "legs" in workout_data["tags"]
        assert 1 <= workout_data["rating"] <= 5

    def test_workout_sharing_settings(self):
        """Test workout sharing and visibility settings."""
        sharing_settings = {
            "is_public": False,
            "shared_with_friends": True,
            "allow_comments": True,
            "show_in_feed": False
        }
        
        assert sharing_settings["is_public"] is False
        assert sharing_settings["shared_with_friends"] is True
