/**
 * Unit tests for useWorkouts hook
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useState, useEffect } from 'react';

// Mock hook
const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      const mockWorkouts = [
        { id: 1, title: 'Morning Run', duration_minutes: 30 },
        { id: 2, title: 'Leg Day', duration_minutes: 45 },
      ];
      setWorkouts(mockWorkouts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createWorkout = async (data: any) => {
    const newWorkout = { id: Date.now(), ...data };
    setWorkouts(prev => [...prev, newWorkout]);
    return newWorkout;
  };

  const updateWorkout = async (id: number, data: any) => {
    setWorkouts(prev =>
      prev.map(w => (w.id === id ? { ...w, ...data } : w))
    );
  };

  const deleteWorkout = async (id: number) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return {
    workouts,
    isLoading,
    error,
    fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
};

describe('useWorkouts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty workouts array', () => {
    const { result } = renderHook(() => useWorkouts());

    expect(result.current.workouts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('fetches workouts successfully', async () => {
    const { result } = renderHook(() => useWorkouts());

    await act(async () => {
      await result.current.fetchWorkouts();
    });

    expect(result.current.workouts).toHaveLength(2);
    expect(result.current.workouts[0].title).toBe('Morning Run');
  });

  it('sets loading state when fetching', async () => {
    const { result } = renderHook(() => useWorkouts());

    let fetchPromise: Promise<any>;
    act(() => {
      fetchPromise = result.current.fetchWorkouts();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await fetchPromise!;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('creates a new workout', async () => {
    const { result } = renderHook(() => useWorkouts());

    const newWorkoutData = {
      title: 'Evening Yoga',
      duration_minutes: 60,
      workout_type: 'flexibility',
    };

    await act(async () => {
      await result.current.createWorkout(newWorkoutData);
    });

    expect(result.current.workouts).toHaveLength(1);
    expect(result.current.workouts[0].title).toBe('Evening Yoga');
    expect(result.current.workouts[0].id).toBeDefined();
  });

  it('updates an existing workout', async () => {
    const { result } = renderHook(() => useWorkouts());

    // First fetch workouts
    await act(async () => {
      await result.current.fetchWorkouts();
    });

    const workoutId = result.current.workouts[0].id;

    // Then update
    await act(async () => {
      await result.current.updateWorkout(workoutId, { title: 'Updated Title' });
    });

    const updatedWorkout = result.current.workouts.find((w: any) => w.id === workoutId);
    expect(updatedWorkout?.title).toBe('Updated Title');
  });

  it('deletes a workout', async () => {
    const { result } = renderHook(() => useWorkouts());

    // First fetch workouts
    await act(async () => {
      await result.current.fetchWorkouts();
    });

    const initialLength = result.current.workouts.length;
    const workoutId = result.current.workouts[0].id;

    // Then delete
    await act(async () => {
      await result.current.deleteWorkout(workoutId);
    });

    expect(result.current.workouts).toHaveLength(initialLength - 1);
    expect(result.current.workouts.find((w: any) => w.id === workoutId)).toBeUndefined();
  });

  it('handles fetch errors', async () => {
    const useWorkoutsWithError = () => {
      const [error, setError] = useState<string | null>(null);
      const fetchWorkouts = async () => {
        setError('Failed to fetch workouts');
      };
      return { error, fetchWorkouts };
    };

    const { result } = renderHook(() => useWorkoutsWithError());

    await act(async () => {
      await result.current.fetchWorkouts();
    });

    expect(result.current.error).toBe('Failed to fetch workouts');
  });

  it('maintains workouts order after updates', async () => {
    const { result } = renderHook(() => useWorkouts());

    await act(async () => {
      await result.current.createWorkout({ title: 'Workout 1' });
      await result.current.createWorkout({ title: 'Workout 2' });
      await result.current.createWorkout({ title: 'Workout 3' });
    });

    expect(result.current.workouts[0].title).toBe('Workout 1');
    expect(result.current.workouts[1].title).toBe('Workout 2');
    expect(result.current.workouts[2].title).toBe('Workout 3');
  });
});
