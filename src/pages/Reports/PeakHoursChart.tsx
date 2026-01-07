import { PeakHour } from '../../store/slices/reportsSlice';

interface Props {
  data: PeakHour[];
}

const PeakHoursChart = ({ data }: Props) => {
  // Find max count for scaling
  const maxCount = Math.max(...data.map(h => h.count), 1);

  // Format hour (24h to 12h format)
  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 animate-fade-down duration-very-fast">Horários de Pico</h2>

      {/* Bar Chart */}
      <div className="space-y-2">
        {data.map((item, index) => {
          const heightPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={item.hour} className="flex items-center gap-2 sm:gap-3 animate-fade-left" style={{ animationDuration: `${300 + index * 50}ms` }}>
              <span className="text-xs font-medium text-gray-600 w-10 sm:w-12">
                {formatHour(item.hour)}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-5 sm:h-6 relative">
                <div
                  className="bg-indigo-500 h-5 sm:h-6 rounded-full transition-all duration-300 flex items-center justify-end pr-1 sm:pr-2"
                  style={{ width: `${heightPercentage}%` }}
                >
                  {item.count > 0 && (
                    <span className="text-xs font-medium text-white">
                      {item.count}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note */}
      <p className="text-xs text-gray-500 mt-3 sm:mt-4 animate-fade-up duration-slow">
        Conversas iniciadas por hora do dia
      </p>
    </div>
  );
};

export default PeakHoursChart;
