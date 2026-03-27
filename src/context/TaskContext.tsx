import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Project, TaskStatus, TaskPriority } from '../types';

interface TaskContextType {
  project: Project | null;
  tasks: Task[];
  allTasks: Task[];
  createTask: (
    name: string,
    startDate: Date,
    endDate: Date,
    priority: TaskPriority,
    parentId?: string
  ) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addSubtask: (parentId: string, subtask: Task) => void;
  initializeProject: (project: Project) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);

  const initializeProject = useCallback((newProject: Project) => {
    setProject(newProject);
  }, []);

  const getTasks = useCallback((): Task[] => {
    if (!project) return [];
    return project.tasks;
  }, [project]);

  const getAllTasks = useCallback((): Task[] => {
    if (!project) return [];
    
    const flattenTasks = (tasks: Task[]): Task[] => {
      return tasks.flatMap(task => [task, ...flattenTasks(task.subtasks)]);
    };
    
    return flattenTasks(project.tasks);
  }, [project]);

  const createTask = useCallback(
    (
      name: string,
      startDate: Date,
      endDate: Date,
      priority: TaskPriority,
      parentId?: string
    ) => {
      if (!project) return;

      const newTask: Task = {
        id: uuidv4(),
        name,
        description: '',
        startDate,
        endDate,
        status: 'not-started',
        progress: 0,
        priority,
        subtasks: [],
        projectId: project.id,
        parentId,
      };

      setProject(prev => {
        if (!prev) return prev;

        if (parentId) {
          // Buscar y validar que el padre existe
          const findAndAddSubtask = (tasks: Task[]): Task[] | null => {
            for (const task of tasks) {
              if (task.id === parentId) {
                return tasks.map(t =>
                  t.id === parentId
                    ? { ...t, subtasks: [...t.subtasks, newTask] }
                    : t
                );
              }
              const result = findAndAddSubtask(task.subtasks);
              if (result) {
                return tasks.map(t => ({
                  ...t,
                  subtasks: t.id === parentId ? result : findAndAddSubtask(t.subtasks) || t.subtasks,
                }));
              }
            }
            return null;
          };

          const updated = findAndAddSubtask(prev.tasks);
          if (!updated) {
            console.error('Padre de subtarea no encontrado:', parentId);
            return prev;
          }
          return { ...prev, tasks: updated };
        }

        // Tareas sin padre se agregan al nivel raíz
        return { ...prev, tasks: [...prev.tasks, newTask] };
      });
    },
    [project]
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setProject(prev => {
      if (!prev) return prev;

      const updateTasks = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === id) {
            return { ...task, ...updates };
          }
          return {
            ...task,
            subtasks: updateTasks(task.subtasks),
          };
        });
      };

      return { ...prev, tasks: updateTasks(prev.tasks) };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setProject(prev => {
      if (!prev) return prev;

      const deleteTasks = (tasks: Task[]): Task[] => {
        return tasks
          .filter(task => task.id !== id)
          .map(task => ({
            ...task,
            subtasks: deleteTasks(task.subtasks),
          }));
      };

      return { ...prev, tasks: deleteTasks(prev.tasks) };
    });
  }, []);

  const addSubtask = useCallback((parentId: string, subtask: Task) => {
    setProject(prev => {
      if (!prev) return prev;

      const addSubtaskToParent = (tasks: Task[]): Task[] => {
        return tasks.map(task => {
          if (task.id === parentId) {
            return { ...task, subtasks: [...task.subtasks, subtask] };
          }
          return {
            ...task,
            subtasks: addSubtaskToParent(task.subtasks),
          };
        });
      };

      return { ...prev, tasks: addSubtaskToParent(prev.tasks) };
    });
  }, []);

  return (
    <TaskContext.Provider
      value={{
        project,
        tasks: getTasks(),
        allTasks: getAllTasks(),
        createTask,
        updateTask,
        deleteTask,
        addSubtask,
        initializeProject,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
