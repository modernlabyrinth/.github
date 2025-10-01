"""
Stress tests for TwoBirds Fit application.
Tests system behavior under extreme load.
"""
from locust import HttpUser, task, between, events
import time


class StressTestUser(HttpUser):
    """User for stress testing with high frequency requests."""
    
    wait_time = between(0.1, 0.5)  # Very short wait times
    
    def on_start(self):
        """Setup for stress test."""
        self.login()
    
    def login(self):
        """Quick login."""
        response = self.client.post("/api/v1/auth/login", json={
            "email": "stress@twobirds.fit",
            "password": "Stress123!"
        })
        
        if response.status_code == 200:
            self.token = response.json().get("access_token")
            self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(10)
    def rapid_reads(self):
        """Rapid read operations."""
        self.client.get("/api/v1/workouts", headers=self.headers)
    
    @task(5)
    def rapid_writes(self):
        """Rapid write operations."""
        self.client.post("/api/v1/workouts", json={
            "title": f"Stress Test {time.time()}",
            "workout_type": "cardio",
            "duration_minutes": 30
        }, headers=self.headers)
    
    @task(3)
    def complex_queries(self):
        """Complex database queries."""
        self.client.get("/api/v1/workouts/stats/detailed", headers=self.headers)
    
    @task(1)
    def heavy_computation(self):
        """Endpoints with heavy computation."""
        self.client.get("/api/v1/analytics/trends", headers=self.headers)


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when stress test starts."""
    print("Starting stress test...")
    print(f"Target host: {environment.host}")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when stress test stops."""
    print("Stress test completed.")
    print(f"Total requests: {environment.stats.num_requests}")
    print(f"Total failures: {environment.stats.num_failures}")


class DatabaseStressUser(HttpUser):
    """Stress test database operations."""
    
    wait_time = between(0.1, 0.3)
    
    @task
    def concurrent_reads(self):
        """Test concurrent read operations."""
        for i in range(10):
            self.client.get(f"/api/v1/workouts/{i}")
    
    @task
    def concurrent_writes(self):
        """Test concurrent write operations."""
        for i in range(5):
            self.client.post("/api/v1/workouts", json={
                "title": f"Concurrent Test {i}",
                "workout_type": "strength",
                "duration_minutes": 45
            })
