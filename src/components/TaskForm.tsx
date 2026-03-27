import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { format } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: TaskStatus;
    priority: TaskPriority;
    progress: number;
    assignee?: string;
  }) => void;
  onCancel: () => void;
  isSubtask?: boolean;
  parentTaskName?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, isSubtask = false, parentTaskName }) => {
  const [formData, setFormData] = useState({
    name: task?.name || '',
    description: task?.description || '',
    startDate: task?.startDate ? format(task.startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    endDate: task?.endDate ? format(task.endDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    status: task?.status || 'not-started' as TaskStatus,
    priority: task?.priority || 'medium' as TaskPriority,
    progress: task?.progress || 0,
    assignee: task?.assignee || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    if (startDate > endDate) {
      newErrors.dateRange = 'La fecha de inicio no puede ser después de la fecha de fin';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'El progreso debe estar entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name,
      description: formData.description,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      status: formData.status,
      priority: formData.priority,
      progress: formData.progress,
      assignee: formData.assignee,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información de vinculación de subtarea */}
      {isSubtask && parentTaskName && (
        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
          <div className="flex items-start gap-3">
            <div className="text-purple-600 mt-0.5">🔗</div>
            <div>
              <p className="text-sm font-semibold text-purple-900">
                Subtarea vinculada a:
              </p>
              <p className="text-sm text-purple-700 mt-1">
                {parentTaskName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la {isSubtask ? 'subtarea' : 'tarea'}
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej: Diseñar interfaz de usuario"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Descripción detallada de la tarea..."
        />
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de inicio
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de fin
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      {errors.dateRange && (
        <p className="text-red-500 text-xs">{errors.dateRange}</p>
      )}

      {/* Grid de opciones */}
      <div className="grid grid-cols-2 gap-4">
        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value as TaskStatus })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="not-started">No iniciado</option>
            <option value="in-progress">En progreso</option>
            <option value="completed">Completado</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as TaskPriority })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>
      </div>

      {/* Progreso */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Progreso: {formData.progress}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.progress}
          onChange={(e) =>
            setFormData({ ...formData, progress: parseInt(e.target.value) })
          }
          className="w-full"
        />
        {errors.progress && (
          <p className="text-red-500 text-xs mt-1">{errors.progress}</p>
        )}
      </div>

      {/* Asignado a */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Asignado a
        </label>
        <input
          type="text"
          value={formData.assignee}
          onChange={(e) =>
            setFormData({ ...formData, assignee: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Nombre del asignado"
        />
      </div>

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-primary text-white py-2 rounded-md hover:bg-blue-600 font-medium transition-colors"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 font-medium transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
