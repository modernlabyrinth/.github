"""
Pytest configuration and shared fixtures for backend tests.
"""
import pytest
import asyncio
from datetime import datetime, timedelta
from typing import Generator, AsyncGenerator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

# Assuming a FastAPI application structure
# from app.main import app
# from app.database import Base, get_db
# from app.models import User, Workout, Exercise


@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
def db_engine():
    """Create a test database engine."""
    DATABASE_URL = "postgresql://test:test@localhost:5432/twobirds_test"
    engine = create_engine(DATABASE_URL)
    # Base.metadata.create_all(bind=engine)
    yield engine
    # Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db_engine) -> Generator[Session, None, None]:
    """Create a new database session for a test."""
    connection = db_engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=connection)
    session = SessionLocal()

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    # app.dependency_overrides[get_db] = override_get_db
    # with TestClient(app) as test_client:
    #     yield test_client
    # app.dependency_overrides.clear()
    pass


@pytest.fixture
def mock_user():
    """Create a mock user object."""
    return {
        "id": 1,
        "email": "test@twobirds.fit",
        "username": "testuser",
        "first_name": "Test",
        "last_name": "User",
        "is_active": True,
        "is_verified": True,
        "created_at": datetime.utcnow(),
    }


@pytest.fixture
def mock_workout():
    """Create a mock workout object."""
    return {
        "id": 1,
        "user_id": 1,
        "title": "Morning Run",
        "description": "5K morning run",
        "workout_type": "cardio",
        "duration_minutes": 30,
        "calories_burned": 250,
        "date": datetime.utcnow().date(),
        "completed": True,
    }


@pytest.fixture
def mock_exercise():
    """Create a mock exercise object."""
    return {
        "id": 1,
        "name": "Push-ups",
        "category": "strength",
        "muscle_group": "chest",
        "description": "Standard push-up exercise",
        "difficulty": "beginner",
    }


@pytest.fixture
def auth_headers(mock_user):
    """Create authentication headers with JWT token."""
    # In real implementation, generate actual JWT token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token"
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


@pytest.fixture
def sample_workout_data():
    """Sample workout data for testing."""
    return {
        "title": "Leg Day",
        "description": "Intense leg workout",
        "workout_type": "strength",
        "duration_minutes": 45,
        "exercises": [
            {
                "exercise_id": 1,
                "sets": 3,
                "reps": 10,
                "weight_kg": 80
            },
            {
                "exercise_id": 2,
                "sets": 4,
                "reps": 8,
                "weight_kg": 100
            }
        ]
    }


@pytest.fixture
def sample_user_registration():
    """Sample user registration data."""
    return {
        "email": "newuser@twobirds.fit",
        "username": "newuser",
        "password": "SecureP@ssw0rd!",
        "first_name": "New",
        "last_name": "User",
        "date_of_birth": "1990-01-01",
        "height_cm": 175,
        "weight_kg": 70,
        "fitness_level": "intermediate"
    }


@pytest.fixture(autouse=True)
def reset_db(db_session):
    """Reset database state before each test."""
    # Clear all tables
    # for table in reversed(Base.metadata.sorted_tables):
    #     db_session.execute(table.delete())
    # db_session.commit()
    pass
