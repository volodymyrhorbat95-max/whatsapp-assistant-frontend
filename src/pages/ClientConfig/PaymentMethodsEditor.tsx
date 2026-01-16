// Payment Methods Editor - Edit accepted payment methods

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, PaymentMethod } from '../../types';
import { Button, Checkbox, FormControlLabel, Alert } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import PixIcon from '@mui/icons-material/Pix';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import MoneyIcon from '@mui/icons-material/Money';

interface Props {
  client: Client;
}

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string; icon: JSX.Element }[] = [
  { value: 'pix', label: 'Pix', icon: <PixIcon fontSize="small" /> },
  { value: 'card', label: 'Cartão', icon: <CreditCardIcon fontSize="small" /> },
  { value: 'cash', label: 'Dinheiro', icon: <MoneyIcon fontSize="small" /> }
];

const PaymentMethodsEditor = ({ client }: Props) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.loading);
  const existingMethods = client.configuration.paymentMethods || [];

  const [selectedMethods, setSelectedMethods] = useState<PaymentMethod[]>(existingMethods);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync local state when client prop updates (after save)
  useEffect(() => {
    setSelectedMethods(client.configuration.paymentMethods || []);
  }, [client.configuration.paymentMethods]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const updatedConfiguration = {
      ...client.configuration,
      paymentMethods: selectedMethods
    };

    const result = await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    // ✅ Check if action succeeded
    if (updateClient.fulfilled.match(result)) {
      setSuccess('Métodos de pagamento salvos com sucesso!');
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error?.message || 'Falha ao salvar métodos de pagamento');
    }
  };

  const handleToggle = (method: PaymentMethod) => {
    const newMethods = selectedMethods.includes(method)
      ? selectedMethods.filter(m => m !== method)
      : [...selectedMethods, method];

    setSelectedMethods(newMethods);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 animate-fade-down duration-very-fast">
          <PaymentIcon className="text-blue-500" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Métodos de Pagamento
          </h2>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
            className="animate-fade-left duration-fast"
            fullWidth
            disabled={isLoading}
            sx={{ maxWidth: { sm: '200px' } }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-4 sm:mb-6 animate-fade-up duration-fast">
        Selecione os métodos de pagamento aceitos pelo seu negócio.
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

      <div className="space-y-3 sm:space-y-4">
        {PAYMENT_OPTIONS.map((option, index) => {
          const isSelected = selectedMethods.includes(option.value);
          const animationDurations = ['very-fast', 'fast', 'normal'];

          return (
            <div
              key={option.value}
              className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all animate-fade-right duration-${animationDurations[index]} ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleToggle(option.value)}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleToggle(option.value)}
                    color="primary"
                  />
                }
                label={
                  <div className="flex items-center gap-2">
                    <span className={isSelected ? 'text-blue-600' : 'text-gray-500'}>
                      {option.icon}
                    </span>
                    <span className={`text-sm sm:text-base font-medium ${
                      isSelected ? 'text-blue-900' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                }
                className="m-0 w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Preview */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg animate-fade-up duration-slow">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Métodos Aceitos
        </h3>
        {selectedMethods.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedMethods.map(method => {
              const option = PAYMENT_OPTIONS.find(o => o.value === method);
              return (
                <span
                  key={method}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium"
                >
                  {option?.icon}
                  {option?.label}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">
            Nenhum método de pagamento selecionado
          </p>
        )}
      </div>

      {/* Warning if no methods selected */}
      {selectedMethods.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-zoom-in duration-normal">
          <p className="text-xs sm:text-sm text-yellow-800">
            Atenção: Selecione pelo menos um método de pagamento para que os clientes possam finalizar pedidos.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsEditor;
