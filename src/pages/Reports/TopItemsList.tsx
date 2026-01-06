import { TopItem } from '../../store/slices/reportsSlice';

interface Props {
  items: TopItem[];
}

const TopItemsList = ({ items }: Props) => {
  // Find max count for scaling
  const maxCount = items.length > 0 ? items[0].count : 1;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Itens Mais Pedidos</h2>

      {/* List */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const widthPercentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <div key={item.name} className="flex items-center gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                <span className="text-sm font-bold text-gray-700">{index + 1}</span>
              </div>

              {/* Item Details */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-900">{item.name}</span>
                  <span className="text-sm text-gray-600 font-semibold">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${widthPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum item pedido neste período</p>
        </div>
      )}
    </div>
  );
};

export default TopItemsList;
