import { PaymentMethodBreakdown } from '../../store/slices/reportsSlice';

interface Props {
  data: PaymentMethodBreakdown[];
}

const PaymentMethodsChart = ({ data }: Props) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Map method codes to PT-BR labels
  const methodLabels: { [key: string]: string } = {
    pix: 'Pix',
    card: 'Cartão',
    cash: 'Dinheiro',
    unknown: 'Não informado'
  };

  // Color palette
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500'
  ];

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 animate-fade-down duration-very-fast">Métodos de Pagamento</h2>

      {/* Bar Chart */}
      <div className="space-y-3 sm:space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          const color = colors[index % colors.length];
          const label = methodLabels[item.method] || item.method;

          return (
            <div key={item.method} className="animate-fade-right" style={{ animationDuration: `${400 + index * 100}ms` }}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
                <span className="text-xs sm:text-sm text-gray-600">
                  {item.count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                <div
                  className={`${color} h-2 sm:h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 animate-fade-up duration-slow">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">Total</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;
