"""
API performance benchmarks.
Measures response times for critical endpoints.
"""
import time
import statistics
import requests
from typing import List, Dict
import json


class APIBenchmark:
    """Benchmark API endpoints."""
    
    def __init__(self, base_url: str, token: str = None):
        self.base_url = base_url
        self.token = token
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}
        self.results = []
    
    def benchmark_endpoint(self, method: str, endpoint: str, 
                          data: Dict = None, iterations: int = 100) -> Dict:
        """Benchmark a single endpoint."""
        times = []
        
        for _ in range(iterations):
            start = time.time()
            
            if method == "GET":
                response = requests.get(f"{self.base_url}{endpoint}", 
                                      headers=self.headers)
            elif method == "POST":
                response = requests.post(f"{self.base_url}{endpoint}", 
                                       json=data, headers=self.headers)
            elif method == "PUT":
                response = requests.put(f"{self.base_url}{endpoint}", 
                                      json=data, headers=self.headers)
            elif method == "DELETE":
                response = requests.delete(f"{self.base_url}{endpoint}", 
                                         headers=self.headers)
            
            elapsed = time.time() - start
            times.append(elapsed)
        
        return {
            "endpoint": endpoint,
            "method": method,
            "iterations": iterations,
            "mean_time": statistics.mean(times),
            "median_time": statistics.median(times),
            "min_time": min(times),
            "max_time": max(times),
            "std_dev": statistics.stdev(times) if len(times) > 1 else 0,
            "p95": self._percentile(times, 95),
            "p99": self._percentile(times, 99)
        }
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile."""
        sorted_data = sorted(data)
        index = int(len(sorted_data) * (percentile / 100))
        return sorted_data[index]
    
    def run_benchmarks(self):
        """Run all benchmarks."""
        print("Running API Benchmarks...")
        
        # Authentication endpoints
        print("\n--- Authentication Endpoints ---")
        login_result = self.benchmark_endpoint(
            "POST", 
            "/api/v1/auth/login",
            {"email": "test@twobirds.fit", "password": "Test123!"}
        )
        self._print_result(login_result)
        
        # Workout endpoints
        print("\n--- Workout Endpoints ---")
        list_workouts = self.benchmark_endpoint("GET", "/api/v1/workouts")
        self._print_result(list_workouts)
        
        get_workout = self.benchmark_endpoint("GET", "/api/v1/workouts/1")
        self._print_result(get_workout)
        
        create_workout = self.benchmark_endpoint(
            "POST",
            "/api/v1/workouts",
            {
                "title": "Benchmark Test",
                "workout_type": "cardio",
                "duration_minutes": 30
            }
        )
        self._print_result(create_workout)
        
        # User endpoints
        print("\n--- User Endpoints ---")
        get_user = self.benchmark_endpoint("GET", "/api/v1/users/me")
        self._print_result(get_user)
        
        # Statistics endpoints
        print("\n--- Statistics Endpoints ---")
        get_stats = self.benchmark_endpoint("GET", "/api/v1/workouts/stats")
        self._print_result(get_stats)
        
        return self.results
    
    def _print_result(self, result: Dict):
        """Print benchmark result."""
        print(f"\n{result['method']} {result['endpoint']}")
        print(f"  Mean: {result['mean_time']*1000:.2f}ms")
        print(f"  Median: {result['median_time']*1000:.2f}ms")
        print(f"  Min: {result['min_time']*1000:.2f}ms")
        print(f"  Max: {result['max_time']*1000:.2f}ms")
        print(f"  P95: {result['p95']*1000:.2f}ms")
        print(f"  P99: {result['p99']*1000:.2f}ms")
        
        self.results.append(result)
    
    def save_results(self, filename: str = "benchmark_results.json"):
        """Save results to file."""
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
        print(f"\nResults saved to {filename}")


if __name__ == "__main__":
    # Run benchmarks
    benchmark = APIBenchmark(
        base_url="http://localhost:8000",
        token="your-test-token-here"
    )
    benchmark.run_benchmarks()
    benchmark.save_results()
