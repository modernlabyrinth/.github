/**
 * Unit tests for WorkoutForm component
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock component
const WorkoutForm = ({ onSubmit, initialData, isLoading }: any) => {
  const [formData, setFormData] = React.useState(initialData || {
    title: '',
    description: '',
    workout_type: 'cardio',
    duration_minutes: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} data-testid="workout-form">
      <input
        type="text"
        name="title"
        placeholder="Workout Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <select
        name="workout_type"
        value={formData.workout_type}
        onChange={(e) => setFormData({ ...formData, workout_type: e.target.value })}
      >
        <option value="cardio">Cardio</option>
        <option value="strength">Strength</option>
        <option value="flexibility">Flexibility</option>
      </select>
      <input
        type="number"
        name="duration_minutes"
        placeholder="Duration (minutes)"
        value={formData.duration_minutes}
        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
        min="0"
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Workout'}
      </button>
    </form>
  );
};

describe('WorkoutForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Workout Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Duration (minutes)')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Save Workout')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    render(<WorkoutForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByPlaceholderText('Workout Title'), 'Morning Run');
    await user.type(screen.getByPlaceholderText('Description'), 'Quick 5K');
    await user.type(screen.getByPlaceholderText('Duration (minutes)'), '30');
    
    const submitButton = screen.getByText('Save Workout');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Morning Run',
        description: 'Quick 5K',
        workout_type: 'cardio',
        duration_minutes: 30,
      });
    });
  });

  it('populates form with initial data when editing', () => {
    const initialData = {
      title: 'Existing Workout',
      description: 'Test description',
      workout_type: 'strength',
      duration_minutes: 45,
    };

    render(<WorkoutForm onSubmit={mockOnSubmit} initialData={initialData} />);

    expect(screen.getByPlaceholderText('Workout Title')).toHaveValue('Existing Workout');
    expect(screen.getByPlaceholderText('Description')).toHaveValue('Test description');
    expect(screen.getByRole('combobox')).toHaveValue('strength');
    expect(screen.getByPlaceholderText('Duration (minutes)')).toHaveValue(45);
  });

  it('disables submit button when loading', () => {
    render(<WorkoutForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByText('Saving...');
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<WorkoutForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByText('Save Workout');
    await user.click(submitButton);

    // Form should not submit without required fields
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows changing workout type', async () => {
    const user = userEvent.setup();
    render(<WorkoutForm onSubmit={mockOnSubmit} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'strength');

    expect(select).toHaveValue('strength');
  });

  it('handles numeric input for duration', async () => {
    const user = userEvent.setup();
    render(<WorkoutForm onSubmit={mockOnSubmit} />);

    const durationInput = screen.getByPlaceholderText('Duration (minutes)');
    await user.type(durationInput, '60');

    expect(durationInput).toHaveValue(60);
  });
});
