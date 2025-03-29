import { Task, SubTask } from '@/types/task';

const API_BASE_URL = 'http://localhost:3001';

// Client-side implementation of getAllTasks
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Client-side implementation of addTask
export const addTask = async (title: string, description?: string): Promise<Task> => {
  if (!title || title.trim() === '') {
    throw new Error('Task title is required');
  }
  
  const newTask: Omit<Task, 'id'> = {
    title: title.trim(),
    description: description?.trim() || '',
    status: 'To Do',
    createdAt: new Date().toISOString(),
    notes: '',
    subtasks: [],
  };
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add task');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

// Client-side implementation of updateTaskStatus
export const updateTaskStatus = async (id: string, status: 'To Do' | 'In Progress' | 'Done'): Promise<Task> => {
  if (!id) {
    throw new Error('Task ID is required');
  }
  
  if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
    throw new Error('Valid status is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
};

// Client-side implementation of updateTaskDescription
export const updateTaskDescription = async (id: string, description: string): Promise<Task> => {
  if (!id) {
    throw new Error('Task ID is required');
  }
  
  if (!description || description.trim() === '') {
    throw new Error('Task description is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task description');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task description:', error);
    throw error;
  }
};

// New function to update task title
export const updateTaskTitle = async (id: string, title: string): Promise<Task> => {
  if (!id) {
    throw new Error('Task ID is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task title');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task title:', error);
    throw error;
  }
};

// New function to update task notes
export const updateTaskNotes = async (id: string, notes: string): Promise<Task> => {
  if (!id) {
    throw new Error('Task ID is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update task notes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task notes:', error);
    throw error;
  }
};

// New function to add a subtask
export const addSubtask = async (taskId: string, description: string): Promise<Task> => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }
  
  if (!description || description.trim() === '') {
    throw new Error('Subtask description is required');
  }
  
  const newSubtask: SubTask = {
    id: crypto.randomUUID(),
    description: description.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  try {
    const task = await getAllTasks().then(tasks => tasks.find(t => t.id === taskId));
    if (!task) {
      throw new Error('Task not found');
    }
    
    const updatedSubtasks = [...(task.subtasks || []), newSubtask];
    
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subtasks: updatedSubtasks }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add subtask');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding subtask:', error);
    throw error;
  }
};

// New function to toggle subtask completion
export const toggleSubtaskCompletion = async (taskId: string, subtaskId: string): Promise<Task> => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }
  
  if (!subtaskId) {
    throw new Error('Subtask ID is required');
  }
  
  try {
    const task = await getAllTasks().then(tasks => tasks.find(t => t.id === taskId));
    if (!task || !task.subtasks) {
      throw new Error('Task or subtasks not found');
    }
    
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subtasks: updatedSubtasks }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update subtask');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error toggling subtask completion:', error);
    throw error;
  }
};

// New function to remove a subtask
export const removeSubtask = async (taskId: string, subtaskId: string): Promise<Task> => {
  if (!taskId) {
    throw new Error('Task ID is required');
  }
  
  if (!subtaskId) {
    throw new Error('Subtask ID is required');
  }
  
  try {
    const task = await getAllTasks().then(tasks => tasks.find(t => t.id === taskId));
    if (!task || !task.subtasks) {
      throw new Error('Task or subtasks not found');
    }
    
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
    
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subtasks: updatedSubtasks }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to remove subtask');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error removing subtask:', error);
    throw error;
  }
}; 