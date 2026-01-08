// Financial Health Card - Display margin estimation metrics

import { FinancialHealth } from '../../store/slices/reportsSlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface Props {
  data: FinancialHealth;
}

const FinancialHealthCard = ({ data }: Props) => {
  const isProfitable = data.estimatedProfit >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 animate-fade-down duration-very-fast">
        Saúde Financeira (Estimativa)
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 animate-fade-right duration-fast">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <AttachMoneyIcon fontSize="small" />
            <span className="text-xs sm:text-sm font-medium">Receita Total</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-blue-900">
            R$ {data.totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {data.orderCount} {data.orderCount === 1 ? 'pedido' : 'pedidos'}
          </p>
        </div>

        {/* Fixed Costs */}
        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 animate-fade-up duration-normal">
          <div className="flex items-center gap-2 text-orange-600 mb-1">
            <ReceiptIcon fontSize="small" />
            <span className="text-xs sm:text-sm font-medium">Custos Fixos</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-orange-900">
            R$ {data.fixedCosts.toFixed(2)}
          </p>
          <p className="text-xs text-orange-600 mt-1">mensal</p>
        </div>

        {/* Variable Costs */}
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 animate-fade-left duration-light-slow">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <ReceiptIcon fontSize="small" />
            <span className="text-xs sm:text-sm font-medium">Custos Variáveis</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold text-yellow-900">
            R$ {data.variableCosts.toFixed(2)}
          </p>
          <p className="text-xs text-yellow-600 mt-1">no período</p>
        </div>

        {/* Estimated Profit */}
        <div className={`rounded-lg p-3 sm:p-4 animate-zoom-in duration-slow ${
          isProfitable ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className={`flex items-center gap-2 mb-1 ${
            isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            {isProfitable ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            <span className="text-xs sm:text-sm font-medium">Lucro Estimado</span>
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${
            isProfitable ? 'text-green-900' : 'text-red-900'
          }`}>
            R$ {data.estimatedProfit.toFixed(2)}
          </p>
          <p className={`text-xs mt-1 ${
            isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            {isProfitable ? 'positivo' : 'negativo'}
          </p>
        </div>

        {/* Profit Margin */}
        <div className={`rounded-lg p-3 sm:p-4 col-span-2 lg:col-span-2 animate-fade-up duration-very-slow ${
          isProfitable ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <div className={`flex items-center gap-2 mb-1 ${
            isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            {isProfitable ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
            <span className="text-xs sm:text-sm font-medium">Margem de Lucro</span>
          </div>
          <p className={`text-lg sm:text-2xl font-bold ${
            isProfitable ? 'text-green-900' : 'text-red-900'
          }`}>
            {data.profitMargin.toFixed(1)}%
          </p>
          <p className={`text-xs mt-1 ${
            isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            da receita total
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 animate-fade-up duration-very-slow">
        * Valores estimados com base nos custos registrados na configuração do cliente.
        Configure os custos na página de configuração do cliente.
      </p>
    </div>
  );
};

export default FinancialHealthCard;
