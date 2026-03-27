# 📊 Planner - Visualizador Gantt de Tareas

Una aplicación web profesional para visualizar, crear y gestionar tareas y subtareas en formato Gantt interactivo.

## ✨ Características

- **Visualización Gantt Interactiva**: Timeline horizontal con zoom ajustable
- **Gestión Jerárquica**: Tareas principales con subtareas anidadas (expandibles/colapsibles)
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar tareas y subtareas
- **Indicadores Visuales**: 
  - Estados: No iniciado, En progreso, Completado
  - Prioridades: Baja, Media, Alta
  - Barra de progreso visual
- **Interfaz Responsiva**: Diseño limpio y moderno con TailwindCSS
- **Filtros y Búsqueda**: Organiza tareas por estado, prioridad y más
- **Edición Inline**: Modifica detalles sin abandonar la vista

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Interfaz de usuario moderna
- **TypeScript** - Type safety
- **Vite** - Bundler ultrarrápido
- **TailwindCSS** - Estilos predefinidos y responsivos
- **date-fns** - Manipulación de fechas

### Estado
- **Context API** - Gestión centralizada de estado
- **UUID** - Generación de IDs únicos

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd Planner

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar compilación
npm run preview
```

## 📁 Estructura del Proyecto

```
Planner/
├── src/
│   ├── components/
│   │   ├── GanttChart.tsx      # Componente principal del Gantt
│   │   ├── TaskRow.tsx          # Fila individual de tarea
│   │   ├── TimelineHeader.tsx   # Encabezado de timeline
│   │   ├── TaskForm.tsx         # Formulario de creación/edición
│   │   └── Modal.tsx            # Componente modal reutilizable
│   ├── context/
│   │   └── TaskContext.tsx      # Contexto de gestión de tareas
│   ├── types.ts                 # Definiciones de tipos
│   ├── App.tsx                  # Componente raíz
│   ├── main.tsx                 # Entry point
│   └── index.css                # Estilos globales
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🎯 Casos de Uso

### 1. Crear una Tarea
```
1. Click en "+ Nueva tarea"
2. Llenar formulario con detalles
3. Hacer click en "Guardar"
```

### 2. Crear Subtareas
```
1. Seleccionar una tarea (clickeando en ella)
2. Click en "+ Subtarea"
3. Completar formulario
4. Guardar
```

### 3. Visualizar Timeline
- **Zoom In/Out**: Botones +/- en la parte superior izquierda
- **Expandir Tareas**: Click en el triángulo (▶) junto a tareas con subtareas
- **Editar Tarea**: Click en cualquier barra de tarea en el timeline

### 4. Actualizar Progreso
- Click en la tarea en el timeline
- Ajustar el slider de progreso
- Guardar cambios

## 🎨 Características de Diseño Gantt

### Visualización Jerárquica
- Tareas principales se pueden expandir
- Subtareas anidadas con indentación visual
- Líneas conectantes (futuro)

### Codificación de Colores
```
Estado:
🔘 Gris      → No iniciado
🔵 Azul      → En progreso
🟢 Verde     → Completado

Prioridad:
🟦 Azul (izq)  → Baja
🟨 Amarillo (izq) → Media
🟥 Rojo (izq)   → Alta
```

### Interactividad
- **Drag & Drop**: Mover tareas en timeline (próximo)
- **Redimensionamiento**: Arrastrar bordes de barra (próximo)
- **Conexiones**: Mostrar dependencias entre tareas (próximo)

## 🚀 Próximas Mejoras

- [ ] Drag & Drop para mover tareas
- [ ] Redimensionamiento de barras de tareas
- [ ] Visualización de dependencias entre tareas
- [ ] Filtros avanzados
- [ ] Exportar a PDF
- [ ] Importar desde CSV/Excel
- [ ] Backend con persistencia en BD
- [ ] Autenticación de usuarios
- [ ] Trabajo colaborativo en tiempo real
- [ ] Notificaciones de cambios
- [ ] Historial de cambios

## 📝 Tipos de Datos

### Task
```typescript
{
  id: string                    // UUID único
  name: string                  // Nombre de la tarea
  description: string           // Descripción detallada
  startDate: Date              // Fecha de inicio
  endDate: Date                // Fecha de fin
  status: TaskStatus           // Estado actual
  progress: number             // Porcentaje completado (0-100)
  priority: TaskPriority       // Nivel de prioridad
  assignee?: string            // Persona asignada
  dependsOn?: string[]         // IDs de tareas predecesoras
  parentId?: string            // ID de tarea padre
  subtasks: Task[]             // Array de subtareas
  projectId: string            // ID del proyecto
}
```

### Project
```typescript
{
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  tasks: Task[]
}
```

## 🔒 Validaciones

- ✅ Nombre de tarea requerido
- ✅ Fecha de inicio ≤ Fecha de fin
- ✅ Progreso entre 0-100%
- ✅ Campos de fecha en formato ISO

## 🌐 Idiomas Soportados

- Español (es) - Actual
- Inglés (en) - Próximamente

## 📄 Licencia

MIT

## 👨‍💻 Autor

Proyecto de planificación Gantt desarrollado con React + TypeScript
