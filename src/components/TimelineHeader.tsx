import React, { useMemo } from 'react';
import { format, addDays, differenceInDays, startOfWeek, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface TimelineHeaderProps {
  dateRange: {
    start: Date;
    end: Date;
  };
  zoomLevel: number;
}

const TimelineHeader: React.FC<TimelineHeaderProps> = ({ dateRange, zoomLevel }) => {
  const totalDays = differenceInDays(dateRange.end, dateRange.start) + 1;
  const dayWidth = 30 * zoomLevel;

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < totalDays; i++) {
      result.push(addDays(dateRange.start, i));
    }
    return result;
  }, [dateRange.start, totalDays]);

  const weeks = useMemo(() => {
    const result: { date: Date; count: number }[] = [];
    let currentWeek = startOfWeek(dateRange.start, { weekStartsOn: 1 });

    while (currentWeek <= dateRange.end) {
      let count = 0;
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentWeek, i);
        if (day >= dateRange.start && day <= dateRange.end) {
          count++;
        }
      }
      if (count > 0) {
        result.push({ date: currentWeek, count });
      }
      currentWeek = addDays(currentWeek, 7);
    }
    return result;
  }, [dateRange]);

  return (
    <div className="flex sticky top-0 z-10 bg-white border-b border-gray-200">
      {/* Columna de tarea (fija) */}
      <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-gray-50 py-2 px-4">
        <div className="text-xs font-bold text-gray-700 uppercase">Tareas</div>
      </div>

      {/* Timeline header */}
      <div className="flex-1 bg-gray-50 overflow-x-auto">
        <div style={{ minWidth: `${totalDays * dayWidth}px` }}>
          {/* Fila de semanas */}
          <div className="flex border-b border-gray-200">
            {weeks.map((week, idx) => (
              <div
                key={idx}
                className="border-r border-gray-200 text-xs font-bold text-gray-700 bg-gray-100 p-1 flex items-center justify-center"
                style={{ width: `${week.count * dayWidth}px` }}
              >
                {format(week.date, 'dd MMM', { locale: es })}
              </div>
            ))}
          </div>

          {/* Fila de días */}
          <div className="flex">
            {days.map((day, idx) => (
              <div
                key={idx}
                className={`border-r border-gray-200 text-xs text-gray-600 flex flex-col items-center justify-center py-1 ${
                  day.getDay() === 0 || day.getDay() === 6
                    ? 'bg-gray-100'
                    : 'bg-white'
                }`}
                style={{ width: `${dayWidth}px`, minHeight: '2.5rem' }}
              >
                <div className="font-semibold">{format(day, 'EEE', { locale: es }).charAt(0).toUpperCase()}</div>
                <div>{format(day, 'd')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHeader;
