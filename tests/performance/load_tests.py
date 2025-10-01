"""
Performance and load tests using Locust.
"""
from locust import HttpUser, task, between
import random
import json


class TwoBirdsFitUser(HttpUser):
    """Simulates a user of the TwoBirds Fit application."""
    
    wait_time = between(1, 3)
    
    def on_start(self):
        """Called when a simulated user starts."""
        self.login()
    
    def login(self):
        """Login user and store auth token."""
        response = self.client.post("/api/v1/auth/login", json={
            "email": f"loadtest{random.randint(1, 1000)}@twobirds.fit",
            "password": "LoadTest123!"
        })
        
        if response.status_code == 200:
            self.token = response.json().get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
        else:
            # Register if login fails
            self.register()
    
    def register(self):
        """Register a new test user."""
        user_id = random.randint(10000, 99999)
        response = self.client.post("/api/v1/auth/register", json={
            "email": f"loadtest{user_id}@twobirds.fit",
            "username": f"loadtest{user_id}",
            "password": "LoadTest123!",
            "first_name": "Load",
            "last_name": "Test"
        })
        
        if response.status_code == 201:
            self.token = response.json().get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(3)
    def view_dashboard(self):
        """View dashboard - most common action."""
        self.client.get("/api/v1/users/me", headers=self.headers)
        self.client.get("/api/v1/workouts/stats", headers=self.headers)
    
    @task(5)
    def list_workouts(self):
        """List user's workouts."""
        self.client.get("/api/v1/workouts", headers=self.headers)
    
    @task(2)
    def view_workout_details(self):
        """View a specific workout."""
        workout_id = random.randint(1, 100)
        self.client.get(f"/api/v1/workouts/{workout_id}", headers=self.headers)
    
    @task(1)
    def create_workout(self):
        """Create a new workout."""
        workout_data = {
            "title": f"Test Workout {random.randint(1, 1000)}",
            "description": "Load test workout",
            "workout_type": random.choice(["cardio", "strength", "flexibility"]),
            "duration_minutes": random.randint(15, 90),
            "calories_burned": random.randint(100, 500)
        }
        
        self.client.post("/api/v1/workouts", 
                        json=workout_data, 
                        headers=self.headers)
    
    @task(1)
    def update_workout(self):
        """Update an existing workout."""
        workout_id = random.randint(1, 100)
        update_data = {
            "title": f"Updated Workout {random.randint(1, 1000)}",
            "completed": True
        }
        
        self.client.patch(f"/api/v1/workouts/{workout_id}",
                         json=update_data,
                         headers=self.headers)
    
    @task(2)
    def search_workouts(self):
        """Search for workouts."""
        search_terms = ["run", "strength", "yoga", "cardio", "leg day"]
        term = random.choice(search_terms)
        self.client.get(f"/api/v1/workouts?search={term}", headers=self.headers)
    
    @task(1)
    def filter_workouts(self):
        """Filter workouts by type."""
        workout_type = random.choice(["cardio", "strength", "flexibility"])
        self.client.get(f"/api/v1/workouts?workout_type={workout_type}", 
                       headers=self.headers)
    
    @task(1)
    def view_profile(self):
        """View user profile."""
        self.client.get("/api/v1/users/me", headers=self.headers)
    
    @task(1)
    def get_statistics(self):
        """Get workout statistics."""
        self.client.get("/api/v1/workouts/stats", headers=self.headers)
        self.client.get("/api/v1/workouts/stats/by-type", headers=self.headers)


class AdminUser(HttpUser):
    """Simulates an admin user with different access patterns."""
    
    wait_time = between(2, 5)
    
    def on_start(self):
        """Login as admin."""
        response = self.client.post("/api/v1/auth/login", json={
            "email": "admin@twobirds.fit",
            "password": "AdminPassword123!"
        })
        
        if response.status_code == 200:
            self.token = response.json().get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task
    def view_all_users(self):
        """View all users (admin only)."""
        self.client.get("/api/v1/admin/users", headers=self.headers)
    
    @task
    def view_system_stats(self):
        """View system-wide statistics."""
        self.client.get("/api/v1/admin/stats", headers=self.headers)
    
    @task
    def moderate_content(self):
        """Moderate user content."""
        self.client.get("/api/v1/admin/reports", headers=self.headers)


class APIOnlyUser(HttpUser):
    """Tests API endpoints only without browser overhead."""
    
    wait_time = between(0.5, 1.5)
    
    @task
    def fast_api_calls(self):
        """Rapid API calls to test throughput."""
        self.client.get("/api/v1/health")
        self.client.get("/api/v1/exercises")
