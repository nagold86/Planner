import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TaskProvider, useTaskContext } from './context/TaskContext';
import { Task, Project } from './types';
import GanttChart from './components/GanttChart';
import TaskForm from './components/TaskForm';
import Modal from './components/Modal';

const AppContent: React.FC = () => {
  const { project, tasks, allTasks, createTask, updateTask, deleteTask, initializeProject } = useTaskContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [creatingSubtaskFor, setCreatingSubtaskFor] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Inicializar proyecto de prueba
  useEffect(() => {
    const sampleProject: Project = {
      id: uuidv4(),
      name: 'Nueva Vista de Migraciones a Edge',
      description: 'Proyecto de migración de vistas a Edge Computing',
      startDate: new Date('2026-03-20'),
      endDate: new Date('2026-06-30'),
      tasks: [
        {
          id: uuidv4(),
          name: 'Diseño de arquitectura',
          description: 'Diseñar la arquitectura general del sistema',
          startDate: new Date('2026-03-20'),
          endDate: new Date('2026-03-28'),
          status: 'completed',
          progress: 100,
          priority: 'high',
          subtasks: [],
          projectId: 'project-1',
        },
        {
          id: uuidv4(),
          name: 'Desarrollo frontend',
          description: 'Implementar interfaz de usuario',
          startDate: new Date('2026-03-29'),
          endDate: new Date('2026-04-20'),
          status: 'in-progress',
          progress: 60,
          priority: 'high',
          subtasks: [
            {
              id: uuidv4(),
              name: 'Componentes de UI',
              description: 'Crear componentes reutilizables',
              startDate: new Date('2026-03-29'),
              endDate: new Date('2026-04-05'),
              status: 'completed',
              progress: 100,
              priority: 'high',
              subtasks: [],
              projectId: 'project-1',
            },
            {
              id: uuidv4(),
              name: 'Integración con API',
              description: 'Conectar frontend con backend',
              startDate: new Date('2026-04-06'),
              endDate: new Date('2026-04-20'),
              status: 'in-progress',
              progress: 50,
              priority: 'high',
              subtasks: [],
              projectId: 'project-1',
            },
          ],
          projectId: 'project-1',
        },
        {
          id: uuidv4(),
          name: 'Testing y QA',
          description: 'Pruebas de calidad y funcionalidad',
          startDate: new Date('2026-04-15'),
          endDate: new Date('2026-05-10'),
          status: 'not-started',
          progress: 0,
          priority: 'medium',
          subtasks: [],
          projectId: 'project-1',
        },
        {
          id: uuidv4(),
          name: 'Despliegue',
          description: 'Preparar despliegue a producción',
          startDate: new Date('2026-05-11'),
          endDate: new Date('2026-06-30'),
          status: 'not-started',
          progress: 0,
          priority: 'high',
          subtasks: [],
          projectId: 'project-1',
        },
      ],
    };

    initializeProject(sampleProject);
  }, [initializeProject]);

  const handleCreateTask = (data: any) => {
    if (creatingSubtaskFor) {
      // Crear una SUBTAREA - VALIDAR que tenga padre
      if (!creatingSubtaskFor) {
        console.error('Error: La subtarea debe estar vinculada a una tarea padre');
        return;
      }
      createTask(
        data.name,
        data.startDate,
        data.endDate,
        data.priority,
        creatingSubtaskFor
      );
      setCreatingSubtaskFor(null);
    } else {
      // Crear una TAREA PRINCIPAL - sin parentId
      createTask(data.name, data.startDate, data.endDate, data.priority);
    }
    closeModal();
  };

  const handleEditTask = (data: any) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    }
    closeModal();
  };

  const handleDeleteTask = () => {
    if (editingTask) {
      deleteTask(editingTask.id);
      closeModal();
    }
  };

  const openCreateTaskModal = () => {
    setEditingTask(null);
    setCreatingSubtaskFor(null);
    setModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setCreatingSubtaskFor(null);
    setModalOpen(true);
  };

  const openCreateSubtaskModal = (parentId: string) => {
    setCreatingSubtaskFor(parentId);
    setEditingTask(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setCreatingSubtaskFor(null);
  };

  const getModalTitle = () => {
    if (creatingSubtaskFor) return 'Crear nueva subtarea';
    if (editingTask) return `Editar: ${editingTask.name}`;
    return 'Crear nueva tarea';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📊 Planner Gantt
              </h1>
              {project && (
                <div className="mt-1">
                  <h2 className="text-lg text-gray-700">{project.name}</h2>
                  <p className="text-sm text-gray-500">{project.description}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={openCreateTaskModal}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors shadow-md"
              >
                + Nueva tarea
              </button>
              {editingTask && (
                <button
                  onClick={() => openCreateSubtaskModal(editingTask.id)}
                  className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-medium transition-colors shadow-md"
                >
                  + Subtarea
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
          {/* Gantt Chart - Ocupa 2 columnas en pantallas grandes */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <GanttChart
              tasks={tasks}
              onEditTask={(task) => setSelectedTaskId(task.id)}
              onAddSubtask={openCreateSubtaskModal}
              selectedTaskId={selectedTaskId}
            />
          </div>

          {/* Panel Datos de tarea seleccionada - Sidebar */}
          <div className="lg:col-span-1">
            {selectedTaskId && allTasks.find(t => t.id === selectedTaskId) ? (
              (() => {
                const selectedTask = allTasks.find(t => t.id === selectedTaskId);
                if (!selectedTask) return null;

                return (
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary sticky top-6 max-h-[calc(100vh-100px)] overflow-y-auto">
                    <div className="space-y-4">
                      {/* Nombre de tarea */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 break-words">
                          {selectedTask.name}
                        </h3>
                      </div>

                      {/* Descripción */}
                      {selectedTask.description && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Descripción:</p>
                          <p className="text-gray-700 text-sm">{selectedTask.description}</p>
                        </div>
                      )}

                      {/* Estado */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Estado:</p>
                        <span className="inline-block px-3 py-1 rounded text-sm font-medium text-white bg-blue-500">
                          {selectedTask.status === 'not-started' && 'No iniciado'}
                          {selectedTask.status === 'in-progress' && 'En progreso'}
                          {selectedTask.status === 'completed' && 'Completado'}
                        </span>
                      </div>

                      {/* Prioridad */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Prioridad:</p>
                        <span className={`inline-block px-3 py-1 rounded text-sm font-medium text-white ${
                          selectedTask.priority === 'low' ? 'bg-blue-400' :
                          selectedTask.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          {selectedTask.priority === 'low' && 'Baja'}
                          {selectedTask.priority === 'medium' && 'Media'}
                          {selectedTask.priority === 'high' && 'Alta'}
                        </span>
                      </div>

                      {/* Fechas */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Fechas:</p>
                        <div className="space-y-1 text-sm">
                          <p>📅 Inicio: <span className="font-medium">{selectedTask.startDate.toLocaleDateString('es-ES')}</span></p>
                          <p>📅 Fin: <span className="font-medium">{selectedTask.endDate.toLocaleDateString('es-ES')}</span></p>
                        </div>
                      </div>

                      {/* Duración */}
                      <div>
                        <p className="text-sm font-medium text-gray-600">Duración:</p>
                        <p className="text-lg font-bold text-blue-600">
                          {Math.ceil(
                            (selectedTask.endDate.getTime() -
                              selectedTask.startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          )} días
                        </p>
                      </div>

                      {/* Progreso */}
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Progreso: {selectedTask.progress}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${selectedTask.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Asignado a */}
                      {selectedTask.assignee && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Asignado a:</p>
                          <p className="text-gray-700 font-medium">{selectedTask.assignee}</p>
                        </div>
                      )}

                      {/* Subtareas */}
                      {selectedTask.subtasks.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Subtareas ({selectedTask.subtasks.length}):</p>
                          <div className="space-y-2">
                            {selectedTask.subtasks.map(sub => (
                              <div
                                key={sub.id}
                                className="p-2 bg-gray-50 rounded border-l-4 border-purple-400 text-sm cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => setSelectedTaskId(sub.id)}
                              >
                                <p className="font-medium text-gray-700">{sub.name}</p>
                                <p className="text-xs text-gray-500">Progreso: {sub.progress}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Separador */}
                      <div className="border-t border-gray-200 pt-4"></div>

                      {/* Botones de acciones */}
                      <div className="space-y-2">
                        <button
                          onClick={() => openEditTaskModal(selectedTask)}
                          className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de que deseas eliminar "${selectedTask.name}"?`)) {
                              deleteTask(selectedTask.id);
                              setSelectedTaskId(null);
                            }
                          }}
                          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          🗑️ Eliminar
                        </button>
                        <button
                          onClick={() => openCreateSubtaskModal(selectedTask.id)}
                          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          ➕ Agregar Subtarea
                        </button>
                      </div>

                      {/* Desseleccionar */}
                      <button
                        onClick={() => setSelectedTaskId(null)}
                        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                      >
                        Deseleccionar
                      </button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center sticky top-6">
                <p className="text-gray-500 text-lg">👈 Selecciona una tarea</p>
                <p className="text-gray-400 text-sm mt-2">Haz click en cualquier tarea del Gantt para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      <Modal isOpen={modalOpen} title={getModalTitle()} onClose={closeModal}>
        <TaskForm
          task={editingTask || undefined}
          onSubmit={editingTask ? handleEditTask : handleCreateTask}
          onCancel={closeModal}
          isSubtask={creatingSubtaskFor !== null}
          parentTaskName={
            creatingSubtaskFor
              ? allTasks.find(t => t.id === creatingSubtaskFor)?.name
              : undefined
          }
        />
      </Modal>
    </div>
  );
};

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  );
}

export default App;
