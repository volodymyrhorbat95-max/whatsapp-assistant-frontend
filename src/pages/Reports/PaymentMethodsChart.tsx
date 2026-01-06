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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h2>

      {/* Bar Chart */}
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          const color = colors[index % colors.length];
          const label = methodLabels[item.method] || item.method;

          return (
            <div key={item.method}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-600">
                  {item.count} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-900">Total</span>
          <span className="text-sm font-semibold text-gray-900">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsChart;
