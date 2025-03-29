'use client';

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Task, SubTask } from "@/types/task";
import { 
  updateTaskStatus, 
  updateTaskDescription, 
  updateTaskTitle,
  updateTaskNotes,
  addSubtask,
  toggleSubtaskCompletion,
  removeSubtask
} from '@/api/taskApiClient';
import { Check, Plus, Trash } from 'lucide-react';

interface TaskDetailModalProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface SubTaskItemProps {
  subtask: SubTask;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const SubTaskItem: React.FC<SubTaskItemProps> = ({ subtask, onToggle, onRemove }) => {
  return (
    <div key={subtask.id} className="flex items-center justify-between py-2 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onToggle(subtask.id)} 
          className={`w-5 h-5 rounded-full flex items-center justify-center ${subtask.completed ? 'bg-green-500 text-white' : 'border border-gray-300'}`}
        >
          {subtask.completed && <Check className="w-3 h-3" />}
        </button>
        <span className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>
          {subtask.description}
        </span>
      </div>
      <button 
        onClick={() => onRemove(subtask.id)} 
        className="text-gray-400 hover:text-red-500"
      >
        <Trash className="w-4 h-4" />
      </button>
    </div>
  );
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, open, onClose, onUpdate }) => {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description);
  const [status, setStatus] = useState<'To Do' | 'In Progress' | 'Done'>(task.status);
  const [notes, setNotes] = useState(task.notes || '');
  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'subtasks' | 'notes'>('details');
  const { toast } = useToast();

  const handleSave = async () => {
    if (description.trim() === '') {
      toast({
        title: "Error",
        description: "Task description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update title if changed
      if (title !== (task.title || '')) {
        await updateTaskTitle(task.id, title);
      }
      
      // Update description if changed
      if (description !== task.description) {
        await updateTaskDescription(task.id, description);
      }
      
      // Update status if changed
      if (status !== task.status) {
        await updateTaskStatus(task.id, status);
      }
      
      // Update notes if changed
      if (notes !== (task.notes || '')) {
        await updateTaskNotes(task.id, notes);
      }
      
      toast({
        title: "Task Updated",
        description: "Task details have been updated successfully",
      });
      
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while updating the task',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskText.trim()) {
      toast({
        title: "Error",
        description: "Subtask description cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      await addSubtask(task.id, newSubtaskText);
      setNewSubtaskText('');
      onUpdate();
      
      toast({
        title: "Subtask Added",
        description: "Subtask has been added successfully",
      });
    } catch (error) {
      console.error('Error adding subtask:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while adding the subtask',
        variant: "destructive",
      });
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    try {
      await toggleSubtaskCompletion(task.id, subtaskId);
      onUpdate();
    } catch (error) {
      console.error('Error toggling subtask:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while updating the subtask',
        variant: "destructive",
      });
    }
  };

  const handleRemoveSubtask = async (subtaskId: string) => {
    try {
      await removeSubtask(task.id, subtaskId);
      onUpdate();
      
      toast({
        title: "Subtask Removed",
        description: "Subtask has been removed successfully",
      });
    } catch (error) {
      console.error('Error removing subtask:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'An error occurred while removing the subtask',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'subtasks' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('subtasks')}
          >
            Subtasks
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'notes' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            Notes
          </button>
        </div>
        
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="task-title" className="text-sm font-medium text-gray-700 block mb-2">
                Title
              </label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="task-description" className="text-sm font-medium text-gray-700 block mb-2">
                Description
              </label>
              <Textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task description"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="task-status" className="text-sm font-medium text-gray-700 block mb-2">
                Status
              </label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'To Do' | 'In Progress' | 'Done')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        {activeTab === 'subtasks' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                placeholder="Add a new subtask..."
                className="flex-1"
              />
              <Button onClick={handleAddSubtask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <SubTaskItem
                  key={subtask.id}
                  subtask={subtask}
                  onToggle={handleToggleSubtask}
                  onRemove={handleRemoveSubtask}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'notes' && (
          <div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this task..."
              className="w-full min-h-[200px]"
            />
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailModal; 