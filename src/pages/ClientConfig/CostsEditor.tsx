// Costs Editor - Edit fixed and variable costs for margin estimation

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, BusinessCosts } from '../../types';
import { Button, TextField, Alert } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PercentIcon from '@mui/icons-material/Percent';

interface Props {
  client: Client;
}

const CostsEditor = ({ client }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const existingCosts = client.configuration.costs || {};

  const [fixedCosts, setFixedCosts] = useState<number>(existingCosts.fixedCosts || 0);
  const [variableCostPercent, setVariableCostPercent] = useState<number>(
    existingCosts.variableCostPercent || 0
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync local state when client prop updates (after save)
  useEffect(() => {
    const costs = client.configuration.costs || {};
    setFixedCosts(costs.fixedCosts || 0);
    setVariableCostPercent(costs.variableCostPercent || 0);
  }, [client.configuration.costs]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const costs: BusinessCosts = {
      fixedCosts,
      variableCostPercent
    };

    const updatedConfiguration = {
      ...client.configuration,
      costs
    };

    const result = await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    // ✅ Check if action succeeded
    if (updateClient.fulfilled.match(result)) {
      setSuccess('Custos salvos com sucesso!');
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error?.message || 'Falha ao salvar custos');
    }
  };

  const handleFixedCostsChange = (value: number) => {
    setFixedCosts(value);
    setHasChanges(true);
  };

  const handleVariableCostChange = (value: number) => {
    setVariableCostPercent(value);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 animate-fade-down duration-very-fast">
          Custos do Negócio
        </h2>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
            className="animate-fade-left duration-fast"
            fullWidth
            sx={{ maxWidth: { sm: '200px' } }}
          >
            Salvar Alterações
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 sm:mb-6 animate-fade-up duration-fast">
        Configure os custos do seu negócio para calcular a estimativa de margem de lucro nos relatórios.
      </p>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="mb-4 animate-fade-down duration-fast">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} className="mb-4 animate-fade-down duration-fast">
          {success}
        </Alert>
      )}

      <div className="space-y-4 sm:space-y-6">
        {/* Fixed Costs */}
        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg animate-fade-right duration-normal">
          <div className="flex items-center gap-2 mb-2">
            <AttachMoneyIcon className="text-orange-500" fontSize="small" />
            <label className="text-sm font-medium text-gray-900">
              Custos Fixos Mensais
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Aluguel, energia, funcionários, etc. Valores que não variam com a quantidade de pedidos.
          </p>
          <TextField
            type="number"
            value={fixedCosts}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              handleFixedCostsChange(Math.max(0, value)); // Ensure non-negative
            }}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: <span className="mr-1 text-gray-500">R$</span>,
                inputProps: { step: '0.01', min: 0 }
              }
            }}
            placeholder="0.00"
          />
        </div>

        {/* Variable Cost Percentage */}
        <div className="p-3 sm:p-4 border border-gray-200 rounded-lg animate-fade-left duration-light-slow">
          <div className="flex items-center gap-2 mb-2">
            <PercentIcon className="text-yellow-500" fontSize="small" />
            <label className="text-sm font-medium text-gray-900">
              Custo Variável (% da Receita)
            </label>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Ingredientes, materiais, embalagens, etc. Porcentagem do valor de cada pedido que vai para custos.
          </p>
          <TextField
            type="number"
            value={variableCostPercent}
            onChange={(e) => {
              const value = parseFloat(e.target.value) || 0;
              handleVariableCostChange(Math.max(0, Math.min(100, value))); // Clamp 0-100
            }}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: <span className="ml-1 text-gray-500">%</span>,
                inputProps: { step: '0.1', min: 0, max: 100 }
              }
            }}
            placeholder="0"
          />
        </div>

        {/* Example Calculation */}
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg animate-zoom-in duration-slow">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Exemplo de Cálculo</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Se você vender R$ 10.000 no mês:</p>
            <p>• Custos Fixos: R$ {fixedCosts.toFixed(2)}</p>
            <p>• Custos Variáveis ({variableCostPercent}%): R$ {(10000 * variableCostPercent / 100).toFixed(2)}</p>
            <p className="font-semibold pt-1 border-t border-blue-200 mt-2">
              • Lucro Estimado: R$ {(10000 - fixedCosts - (10000 * variableCostPercent / 100)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostsEditor;
