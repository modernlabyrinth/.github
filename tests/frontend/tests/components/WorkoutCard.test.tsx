/**
 * Unit tests for WorkoutCard component
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

// Mock component - replace with actual import
const WorkoutCard = ({ workout, onEdit, onDelete }: any) => (
  <div data-testid="workout-card">
    <h3>{workout.title}</h3>
    <p>{workout.description}</p>
    <span>{workout.duration_minutes} min</span>
    <span>{workout.calories_burned} cal</span>
    <button onClick={() => onEdit(workout.id)}>Edit</button>
    <button onClick={() => onDelete(workout.id)}>Delete</button>
  </div>
);

describe('WorkoutCard', () => {
  const mockWorkout = {
    id: 1,
    title: 'Morning Run',
    description: '5K run in the park',
    workout_type: 'cardio',
    duration_minutes: 30,
    calories_burned: 250,
    date: '2025-10-01',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workout card with correct data', () => {
    render(
      <WorkoutCard 
        workout={mockWorkout} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('5K run in the park')).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('250 cal')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <WorkoutCard 
        workout={mockWorkout} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <WorkoutCard 
        workout={mockWorkout} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('is accessible', async () => {
    const { container } = render(
      <WorkoutCard 
        workout={mockWorkout} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalWorkout = {
      id: 2,
      title: 'Quick Workout',
      duration_minutes: 15,
    };

    render(
      <WorkoutCard 
        workout={minimalWorkout} 
        onEdit={mockOnEdit} 
        onDelete={mockOnDelete} 
      />
    );

    expect(screen.getByText('Quick Workout')).toBeInTheDocument();
  });
});
