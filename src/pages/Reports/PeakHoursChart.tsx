import { PeakHour } from '../../store/slices/reportsSlice';

interface Props {
  data: PeakHour[];
}

const PeakHoursChart = ({ data }: Props) => {
  // Find max count for scaling
  const maxCount = Math.max(...data.map(h => h.count), 1);

  // Format hour (24h format)
  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 animate-fade-down duration-very-fast">
        Horários de Pico
      </h2>

      {/* Vertical Column Chart - Time horizontal, bars vertical */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-full flex flex-col gap-2 h-64 sm:h-80 lg:h-96">
          {/* Chart area - Vertical bars */}
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 border-l border-b border-gray-300 pl-2 pb-2">
            {data.map((item, index) => {
              const heightPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

              return (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center justify-end h-full animate-fade-up"
                  style={{ animationDuration: `${300 + index * 30}ms` }}
                >
                  <div className="w-full relative group flex flex-col justify-end" style={{ height: `${heightPercentage}%` }}>
                    {/* Vertical bar */}
                    <div
                      className="w-full h-full bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600 flex items-start justify-center pt-1"
                      style={{
                        minHeight: item.count > 0 ? '8px' : '0',
                        minWidth: '8px'
                      }}
                    >
                      {/* Count inside bar if tall enough */}
                      {heightPercentage > 15 && (
                        <span className="text-white text-[10px] sm:text-xs font-semibold">
                          {item.count}
                        </span>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {formatHour(item.hour)}: {item.count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis - Time labels (horizontal) */}
          <div className="flex items-center justify-between gap-1 sm:gap-2 pl-2">
            {data.map((item, index) => (
              <div key={`label-${item.hour}`} className="flex-1 flex justify-center">
                {index % 3 === 0 && (
                  <span className="text-[9px] sm:text-xs text-gray-600 whitespace-nowrap">
                    {formatHour(item.hour)}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500 mt-3 sm:mt-4 animate-fade-up duration-slow">
        Conversas iniciadas por hora do dia
      </p>
    </div>
  );
};

export default PeakHoursChart;
