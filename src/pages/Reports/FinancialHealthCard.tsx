// Financial Health Card - Display margin estimation metrics with input fields

import { useState, useEffect } from 'react';
import { FinancialHealth } from '../../store/slices/reportsSlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { TextField } from '@mui/material';

interface Props {
  data: FinancialHealth;
}

const FinancialHealthCard = ({ data }: Props) => {
  // Local state for cost inputs
  const [fixedCosts, setFixedCosts] = useState<number>(data.fixedCosts);
  const [variableCostPercent, setVariableCostPercent] = useState<number>(
    data.variableCosts > 0 ? (data.variableCosts / data.totalRevenue) * 100 : 0
  );

  // Update local state when data changes
  useEffect(() => {
    setFixedCosts(data.fixedCosts);
    setVariableCostPercent(
      data.variableCosts > 0 ? (data.variableCosts / data.totalRevenue) * 100 : 0
    );
  }, [data]);

  // Calculate dynamic values based on user input
  const calculatedVariableCosts = (data.totalRevenue * variableCostPercent) / 100;
  const calculatedProfit = data.totalRevenue - fixedCosts - calculatedVariableCosts;
  const calculatedMargin = data.totalRevenue > 0 ? (calculatedProfit / data.totalRevenue) * 100 : 0;
  const isProfitable = calculatedProfit >= 0;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 animate-fade-down duration-very-fast">
        Saúde Financeira (Estimativa)
      </h2>

      {/* Input Fields Section */}
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 animate-fade-right duration-fast">
        <h3 className="text-sm font-medium text-blue-900 mb-3">Insira seus custos para calcular a margem</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Fixed Costs Input */}
          <TextField
            label="Custos Fixos Mensais"
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(parseFloat(e.target.value) || 0)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: <span className="mr-1 text-gray-500">R$</span>,
                inputProps: { step: '0.01', min: 0 }
              }
            }}
            helperText="Aluguel, energia, funcionários, etc."
            className="animate-fade-up duration-normal"
          />

          {/* Variable Cost Percentage Input */}
          <TextField
            label="Custo Variável (% da Receita)"
            type="number"
            value={variableCostPercent}
            onChange={(e) => setVariableCostPercent(parseFloat(e.target.value) || 0)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: <span className="ml-1 text-gray-500">%</span>,
                inputProps: { step: '0.1', min: 0, max: 100 }
              }
            }}
            helperText="Ingredientes, materiais, embalagens, etc."
            className="animate-fade-up duration-light-slow"
          />
        </div>
      </div>

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
            R$ {calculatedVariableCosts.toFixed(2)}
          </p>
          <p className="text-xs text-yellow-600 mt-1">no período ({variableCostPercent.toFixed(1)}%)</p>
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
            R$ {calculatedProfit.toFixed(2)}
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
            {calculatedMargin.toFixed(1)}%
          </p>
          <p className={`text-xs mt-1 ${
            isProfitable ? 'text-green-600' : 'text-red-600'
          }`}>
            da receita total
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-4 animate-fade-up duration-very-slow">
        * Valores calculados dinamicamente. Ajuste os campos acima para ver como diferentes custos afetam sua margem de lucro.
      </p>
    </div>
  );
};

export default FinancialHealthCard;
