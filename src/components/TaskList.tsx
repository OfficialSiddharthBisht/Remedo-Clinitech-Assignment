'use client';

import React from 'react';
import TaskItem from './TaskItem';
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MoveIcon } from "lucide-react";
import { updateTaskStatus } from '@/api/taskApiClient';

interface TaskListProps {
  tasks: Task[];
  onStatusUpdated: () => void;
  error: string | null;
  onRetry: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onStatusUpdated, error, onRetry }) => {
  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }
  
  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No tasks yet. Add your first task above!</p>
      </div>
    );
  }

  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  const handleDragStart = (e: React.DragEvent, taskId: string, currentStatus: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', currentStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, newStatus: 'To Do' | 'In Progress' | 'Done') => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== newStatus) {
      try {
        await updateTaskStatus(taskId, newStatus);
        onStatusUpdated();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <div 
        className="space-y-3"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'To Do')}
      >
        <Card className="p-4 bg-gray-50 border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">TO DO</h3>
            <MoveIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {todoTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusUpdated={onStatusUpdated}
                onDragStart={(e) => handleDragStart(e, task.id, task.status)}
              />
            ))}
          </div>
        </Card>
      </div>
      
      {/* In Progress Column */}
      <div 
        className="space-y-3"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'In Progress')}
      >
        <Card className="p-4 bg-gray-50 border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">IN PROGRESS</h3>
            <MoveIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusUpdated={onStatusUpdated}
                onDragStart={(e) => handleDragStart(e, task.id, task.status)}
              />
            ))}
          </div>
        </Card>
      </div>
      
      {/* Done Column */}
      <div 
        className="space-y-3"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'Done')}
      >
        <Card className="p-4 bg-gray-50 border-t-4 border-t-green-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">DONE</h3>
            <MoveIcon className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {doneTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onStatusUpdated={onStatusUpdated}
                onDragStart={(e) => handleDragStart(e, task.id, task.status)}
              />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TaskList; 