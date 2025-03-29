'use client';

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Task } from "@/types/task";
import { Clock, CheckCircle2, Circle } from "lucide-react";
import { updateTaskStatus } from '@/api/taskApiClient';
import TaskDetailModal from './TaskDetailModal';

interface TaskItemProps {
  task: Task;
  onStatusUpdated: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStatusUpdated, onDragStart }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-blue-50 border-blue-200';
      case 'In Progress': return 'bg-purple-50 border-purple-200';
      case 'Done': return 'bg-green-50 border-green-200';
      default: return '';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'To Do': return <Circle className="h-5 w-5 text-blue-500" />;
      case 'In Progress': return <Clock className="h-5 w-5 text-purple-500" />;
      case 'Done': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return null;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    
    try {
      await updateTaskStatus(task.id, newStatus as 'To Do' | 'In Progress' | 'Done');
      
      toast({
        title: "Status Updated",
        description: `Task status changed to ${newStatus}`,
      });
      onStatusUpdated();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTaskClick = (e: React.MouseEvent) => {
    // Prevent click event when clicking on the select dropdown
    if ((e.target as HTMLElement).closest('.status-select')) return;
    setShowModal(true);
  };

  // Count completed subtasks if they exist
  const completedSubtasks = task.subtasks 
    ? task.subtasks.filter(subtask => subtask.completed).length 
    : 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <>
      <Card 
        className={`mb-3 ${getStatusColor(task.status)} transition-all duration-200 cursor-pointer`}
        draggable
        onDragStart={onDragStart}
        onClick={handleTaskClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                {getStatusIcon(task.status)}
                <div>
                  {task.title && (
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                  )}
                  <p className="text-gray-800">{task.description}</p>
                </div>
              </div>
              
              {totalSubtasks > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Subtasks: {completedSubtasks}/{totalSubtasks}
                </div>
              )}
            </div>
            <div className="status-select" onClick={(e) => e.stopPropagation()}>
              <Select 
                disabled={isUpdating}
                value={task.status} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showModal && (
        <TaskDetailModal 
          task={task} 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onUpdate={onStatusUpdated}
        />
      )}
    </>
  );
};

export default TaskItem; 