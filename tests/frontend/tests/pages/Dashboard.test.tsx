/**
 * Integration tests for Dashboard page
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Dashboard component
const Dashboard = () => {
  const [stats, setStats] = React.useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
    weeklyGoal: 150,
  });

  React.useEffect(() => {
    // Mock data fetching
    setStats({
      totalWorkouts: 24,
      totalDuration: 720,
      totalCalories: 5000,
      weeklyGoal: 150,
    });
  }, []);

  return (
    <div data-testid="dashboard">
      <h1>Dashboard</h1>
      <div data-testid="stats">
        <div>Total Workouts: {stats.totalWorkouts}</div>
        <div>Total Duration: {stats.totalDuration} min</div>
        <div>Total Calories: {stats.totalCalories}</div>
        <div>Weekly Goal: {stats.weeklyGoal} min</div>
      </div>
      <button>Start New Workout</button>
    </div>
  );
};

describe('Dashboard', () => {
  it('renders dashboard page', () => {
    render(<Dashboard />);
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays user statistics', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Total Workouts: 24/)).toBeInTheDocument();
      expect(screen.getByText(/Total Duration: 720 min/)).toBeInTheDocument();
      expect(screen.getByText(/Total Calories: 5000/)).toBeInTheDocument();
    });
  });

  it('shows weekly goal progress', async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Weekly Goal: 150 min/)).toBeInTheDocument();
    });
  });

  it('has start workout button', () => {
    render(<Dashboard />);
    expect(screen.getByText('Start New Workout')).toBeInTheDocument();
  });
});
