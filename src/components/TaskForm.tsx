'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { PlusCircle } from "lucide-react";
import { addTask } from '@/api/taskApiClient';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addTask(title.trim(), description.trim());
      
      setTitle('');
      setDescription('');
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      onTaskAdded();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
          disabled={isSubmitting}
        />
        <Input
          type="text"
          placeholder="Enter task description (optional)..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
          disabled={isSubmitting}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>
    </form>
  );
}

export default TaskForm; 