import React, { useState, useMemo } from 'react';
import { format, addDays, isBetween } from 'date-fns';
import { Task } from '../types';
import { useTaskContext } from '../context/TaskContext';
import TaskRow from './TaskRow';
import TimelineHeader from './TimelineHeader';

interface GanttChartProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onAddSubtask: (parentId: string) => void;
  selectedTaskId?: string;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onEditTask, onAddSubtask, selectedTaskId }) => {
  const { project } = useTaskContext();
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [zoomLevel, setZoomLevel] = useState(1);

  const dateRange = useMemo(() => {
    if (!project || tasks.length === 0) {
      const today = new Date();
      return {
        start: today,
        end: addDays(today, 90),
      };
    }

    const allDates = tasks.flatMap(task => [task.startDate, task.endDate]);
    const start = new Date(Math.min(...allDates.map(d => d.getTime())));
    const end = new Date(Math.max(...allDates.map(d => d.getTime())));

    return { start, end };
  }, [project, tasks]);

  const toggleExpanded = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const renderTasks = (taskList: Task[], depth = 0): React.ReactNode[] => {
    return taskList.flatMap(task => [
      <TaskRow
        key={task.id}
        task={task}
        dateRange={dateRange}
        depth={depth}
        zoomLevel={zoomLevel}
        isExpanded={expandedTasks.has(task.id)}
        onToggleExpand={() => toggleExpanded(task.id)}
        onEdit={() => onEditTask(task)}
        onAddSubtask={() => onAddSubtask(task.id)}
        isSelected={selectedTaskId === task.id}
      />,
      ...(expandedTasks.has(task.id)
        ? renderTasks(task.subtasks, depth + 1)
        : []),
    ]);
  };

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Controles de zoom */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 bg-gray-50">
        <label className="text-sm font-medium text-gray-700">Zoom:</label>
        <button
          onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="text-sm font-medium w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          +
        </button>
      </div>

      {/* Tabla Gantt */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Header de Timeline */}
          <TimelineHeader dateRange={dateRange} zoomLevel={zoomLevel} />

          {/* Filas de tareas */}
          <div className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay tareas. Crea una nueva tarea para comenzar.
              </div>
            ) : (
              renderTasks(tasks)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
