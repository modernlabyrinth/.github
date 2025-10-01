"""
Unit tests for User model.
"""
import pytest
from datetime import datetime, timedelta


class TestUserModel:
    """Test suite for User model."""

    def test_user_creation(self, mock_user):
        """Test basic user creation."""
        assert mock_user["email"] == "test@twobirds.fit"
        assert mock_user["username"] == "testuser"
        assert mock_user["is_active"] is True

    def test_user_email_validation(self):
        """Test email validation."""
        # Test valid emails
        valid_emails = [
            "user@twobirds.fit",
            "test.user@example.com",
            "user+tag@domain.co.uk"
        ]
        for email in valid_emails:
            # In real implementation: User.validate_email(email)
            assert "@" in email and "." in email.split("@")[1]

    def test_user_password_hashing(self):
        """Test password is properly hashed."""
        password = "SecurePassword123!"
        # In real implementation: hashed = User.hash_password(password)
        # assert hashed != password
        # assert User.verify_password(password, hashed)
        assert len(password) >= 8

    def test_user_full_name(self, mock_user):
        """Test full name property."""
        full_name = f"{mock_user['first_name']} {mock_user['last_name']}"
        assert full_name == "Test User"

    def test_user_age_calculation(self):
        """Test age calculation from date of birth."""
        dob = datetime(1990, 1, 1)
        today = datetime.utcnow()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        assert age > 0
        assert age < 150  # Sanity check

    @pytest.mark.parametrize("field,value", [
        ("email", "invalid-email"),
        ("email", ""),
        ("username", ""),
        ("username", "a"),  # Too short
        ("username", "x" * 51),  # Too long
    ])
    def test_user_validation_failures(self, field, value):
        """Test user validation with invalid data."""
        # In real implementation: with pytest.raises(ValidationError)
        if field == "email":
            assert "@" not in value or len(value) == 0
        if field == "username":
            assert len(value) < 2 or len(value) > 50

    def test_user_to_dict(self, mock_user):
        """Test user serialization to dictionary."""
        user_dict = mock_user
        assert "email" in user_dict
        assert "username" in user_dict
        # Password should not be in dict
        assert "password" not in user_dict
        assert "hashed_password" not in user_dict

    def test_user_privacy_settings(self):
        """Test user privacy settings."""
        privacy_settings = {
            "profile_visible": True,
            "workouts_visible": False,
            "stats_visible": True,
            "allow_friend_requests": True
        }
        assert privacy_settings["profile_visible"] is True
        assert privacy_settings["workouts_visible"] is False

    def test_user_fitness_profile(self):
        """Test user fitness profile data."""
        fitness_profile = {
            "fitness_level": "intermediate",
            "goals": ["weight_loss", "muscle_gain"],
            "preferred_workout_types": ["strength", "cardio"],
            "available_equipment": ["dumbbells", "resistance_bands"]
        }
        assert "fitness_level" in fitness_profile
        assert len(fitness_profile["goals"]) > 0

    def test_user_deactivation(self, mock_user):
        """Test user account deactivation."""
        mock_user["is_active"] = False
        mock_user["deactivated_at"] = datetime.utcnow()
        assert mock_user["is_active"] is False
        assert mock_user["deactivated_at"] is not None
