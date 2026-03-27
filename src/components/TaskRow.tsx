import React, { useMemo } from 'react';
import {
  differenceInDays,
  startOfDay,
  addDays,
  isBetween,
  max,
  min,
} from 'date-fns';
import { Task, TaskStatus } from '../types';

interface DateRange {
  start: Date;
  end: Date;
}

interface TaskRowProps {
  task: Task;
  dateRange: DateRange;
  depth: number;
  zoomLevel: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onAddSubtask: () => void;
  isSelected: boolean;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  dateRange,
  depth,
  zoomLevel,
  isExpanded,
  onToggleExpand,
  onEdit,
  onAddSubtask,
  isSelected,
}) => {
  const totalDays = differenceInDays(dateRange.end, dateRange.start) + 1;

  const taskMetrics = useMemo(() => {
    const taskStart = max([task.startDate, dateRange.start]);
    const taskEnd = min([task.endDate, dateRange.end]);
    const daysFromStart = differenceInDays(taskStart, dateRange.start);
    const duration = differenceInDays(taskEnd, taskStart) + 1;

    return {
      leftPercent: (daysFromStart / totalDays) * 100,
      widthPercent: (duration / totalDays) * 100,
    };
  }, [task, dateRange, totalDays]);

  const statusColors: Record<TaskStatus, string> = {
    'not-started': 'bg-gray-300',
    'in-progress': 'bg-blue-500',
    'completed': 'bg-green-500',
  };

  const priorityColors: Record<string, string> = {
    low: 'border-l-4 border-blue-400',
    medium: 'border-l-4 border-yellow-400',
    high: 'border-l-4 border-red-400',
  };

  return (
    <>
      <div
        className={`flex items-center min-h-16 border-b border-gray-100 ${
          isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
        } transition-colors`}
      >
        {/* Columna de tarea */}
        <div className="w-80 flex-shrink-0 border-r border-gray-200 p-4">
          <div className="flex items-center gap-2">
            {task.subtasks.length > 0 && (
              <button
                onClick={onToggleExpand}
                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
            {task.subtasks.length === 0 && <div className="w-6" />}

            <button
              onClick={onEdit}
              className="flex-1 text-left group"
            >
              <div
                className={`text-sm font-medium text-gray-900 truncate ${priorityColors[task.priority]} pl-0 group-hover:text-blue-600`}
              >
                {task.name}
              </div>
              {task.description && (
                <div className="text-xs text-gray-500 truncate">
                  {task.description}
                </div>
              )}
            </button>

            {/* Badge de estado */}
            <span
              className={`text-xs font-medium px-2 py-1 rounded text-white ${statusColors[task.status]}`}
            >
              {task.status === 'not-started' && 'No iniciado'}
              {task.status === 'in-progress' && 'En progreso'}
              {task.status === 'completed' && 'Completado'}
            </span>

            {/* Botón agregar subtarea */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddSubtask();
              }}
              className="ml-2 px-2 py-1 text-xs font-medium text-white bg-purple-500 hover:bg-purple-600 rounded transition-colors"
              title="Agregar subtarea"
            >
              + Sub
            </button>
          </div>
        </div>

        {/* Columna de timeline */}
        <div
          className="flex-1 relative h-16 bg-gray-50"
          style={{
            minWidth: `${totalDays * 30 * zoomLevel}px`,
          }}
        >
          {/* Barra de tarea */}
          <div
            className="absolute top-1/2 transform -translate-y-1/2 rounded h-8 flex items-center justify-between px-2 group cursor-move hover:shadow-md transition-all"
            style={{
              left: `calc(${taskMetrics.leftPercent}% + 2px)`,
              width: `calc(${taskMetrics.widthPercent}% - 4px)`,
              backgroundColor: statusColors[task.status],
            }}
            onClick={onEdit}
          >
            {/* Progreso */}
            <div className="absolute inset-0 rounded bg-black/10 group-hover:bg-black/20 transition-colors" />

            {/* Indicador de progreso */}
            {task.progress > 0 && (
              <div
                className="absolute inset-0 rounded bg-green-400 opacity-30"
                style={{ width: `${task.progress}%` }}
              />
            )}

            {/* Texto de duración */}
            <span className="relative text-xs font-semibold text-white text-center w-full overflow-hidden text-ellipsis whitespace-nowrap">
              {task.progress}%
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskRow;
