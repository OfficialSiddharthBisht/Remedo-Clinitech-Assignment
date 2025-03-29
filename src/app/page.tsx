'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import { Task } from '@/types/task';
import { getAllTasks } from '@/api/taskApiClient';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while fetching tasks');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to load tasks',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 max-w-7xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Tracker</h1>
          <p className="text-gray-600">Drag and drop tasks between columns to update their status</p>
        </header>
        
        <main>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <TaskForm onTaskAdded={fetchTasks} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Your Tasks</h2>
            
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <TaskList 
                tasks={tasks} 
                onStatusUpdated={fetchTasks} 
                error={error}
                onRetry={fetchTasks}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
