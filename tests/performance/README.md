# Performance Tests

Performance and load testing suite for TwoBirds Fit.

## Overview

This directory contains performance tests using Locust for load testing and custom benchmarking scripts for API performance measurement.

## Test Types

### 1. Load Tests (`load_tests.py`)
Simulates normal user traffic patterns to test system behavior under realistic load.

**Run load tests:**
```bash
locust -f load_tests.py --host=http://localhost:8000
```

Then open http://localhost:8089 in your browser to configure:
- Number of users
- Spawn rate
- Duration

**Headless mode:**
```bash
locust -f load_tests.py --host=http://localhost:8000 --headless -u 100 -r 10 -t 60s
```

### 2. Stress Tests (`stress_tests.py`)
Tests system behavior under extreme load conditions.

```bash
locust -f stress_tests.py --host=http://localhost:8000 --headless -u 500 -r 50 -t 300s
```

### 3. API Benchmarks (`api_benchmarks.py`)
Measures response times for critical endpoints.

```bash
python api_benchmarks.py
```

## Performance Targets

### Response Time Targets
- **API Endpoints**: < 200ms (p95)
- **Database Queries**: < 100ms (p95)
- **Page Load**: < 2s
- **Search**: < 500ms

### Throughput Targets
- **Concurrent Users**: 1000+
- **Requests per Second**: 500+
- **Database Connections**: Handle 200 concurrent connections

### Resource Usage Targets
- **CPU**: < 70% under normal load
- **Memory**: < 2GB per instance
- **Database**: < 80% connection pool usage

## Load Test Scenarios

### Scenario 1: Normal Traffic
- 100 concurrent users
- 10 users/second spawn rate
- 15 minute duration

```bash
locust -f load_tests.py --host=http://localhost:8000 --headless -u 100 -r 10 -t 15m
```

### Scenario 2: Peak Traffic
- 500 concurrent users
- 25 users/second spawn rate
- 30 minute duration

```bash
locust -f load_tests.py --host=http://localhost:8000 --headless -u 500 -r 25 -t 30m
```

### Scenario 3: Stress Test
- 1000 concurrent users
- 50 users/second spawn rate
- 60 minute duration

```bash
locust -f stress_tests.py --host=http://localhost:8000 --headless -u 1000 -r 50 -t 60m
```

## Monitoring During Tests

### Key Metrics to Monitor
1. **Response Times**: P50, P95, P99
2. **Error Rate**: Should be < 1%
3. **Throughput**: Requests per second
4. **Resource Usage**: CPU, Memory, Disk I/O
5. **Database Performance**: Query times, connection pool

### Tools
- Locust Web UI: http://localhost:8089
- Application metrics: Prometheus/Grafana
- Database monitoring: pg_stat_statements
- System monitoring: htop, iotop

## Results Analysis

### Good Performance Indicators
- ✅ P95 response time < 200ms
- ✅ Error rate < 0.1%
- ✅ Linear scalability up to target users
- ✅ No memory leaks over time
- ✅ Database connection pool stable

### Performance Issues to Watch For
- ❌ Response time degradation over time
- ❌ Increasing error rates
- ❌ Memory leaks
- ❌ Database connection exhaustion
- ❌ CPU throttling

## Optimization Tips

### Backend Optimizations
1. Add database indexes for frequent queries
2. Implement caching (Redis)
3. Use connection pooling
4. Optimize N+1 queries
5. Add CDN for static assets

### Database Optimizations
1. Query optimization
2. Proper indexing
3. Connection pooling
4. Read replicas for scaling
5. Query result caching

### Frontend Optimizations
1. Code splitting
2. Lazy loading
3. Image optimization
4. Asset compression
5. Service workers for caching

## Continuous Performance Testing

### CI/CD Integration
Run performance tests as part of CI/CD pipeline:

```yaml
# .github/workflows/performance.yml
- name: Run Performance Tests
  run: |
    locust -f tests/performance/load_tests.py \
      --host=https://staging.twobirds.fit \
      --headless -u 50 -r 5 -t 5m \
      --html=performance-report.html
```

### Performance Budgets
Set thresholds in CI/CD:
- API response time P95 < 200ms
- Error rate < 0.1%
- Memory usage < 2GB
- Database query time P95 < 100ms

## Troubleshooting

### High Response Times
1. Check database query performance
2. Look for N+1 queries
3. Check for missing indexes
4. Review cache hit rates
5. Check network latency

### High Error Rates
1. Check application logs
2. Review database connection pool
3. Check for rate limiting
4. Review resource constraints
5. Check for deadlocks

### Resource Exhaustion
1. Check for memory leaks
2. Review database connections
3. Check file handles
4. Monitor disk space
5. Review cache sizes

## Reports

Performance test reports are generated in:
- `performance-report.html`: Locust HTML report
- `benchmark_results.json`: API benchmark results
- `performance-metrics.csv`: Time series metrics

## Best Practices

1. **Baseline First**: Establish baseline performance before making changes
2. **Consistent Environment**: Use identical test environments
3. **Realistic Data**: Use production-like data volumes
4. **Gradual Ramp-up**: Increase load gradually
5. **Monitor Everything**: Track all key metrics
6. **Regular Testing**: Run performance tests regularly
7. **Document Results**: Keep history of performance metrics
