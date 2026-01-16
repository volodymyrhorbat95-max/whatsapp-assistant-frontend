// Client Configuration Page - Edit client catalog, messages, and operating hours

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchClient } from '../../store/slices/clientSlice';
import CatalogEditor from './CatalogEditor';
import MessagesEditor from './MessagesEditor';
import HoursEditor from './HoursEditor';
import CostsEditor from './CostsEditor';
import PaymentMethodsEditor from './PaymentMethodsEditor';

type TabType = 'catalog' | 'messages' | 'hours' | 'payments' | 'costs';

const ClientConfig = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentClient } = useAppSelector((state) => state.client);
  const { isLoading } = useAppSelector((state) => state.loading);
  const [activeTab, setActiveTab] = useState<TabType>('catalog');
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchClient(parseInt(id, 10))).finally(() => {
        setHasAttemptedLoad(true);
      });
    }
  }, [id, dispatch]);

  // Show loading state while fetching client
  if (isLoading || !hasAttemptedLoad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 animate-pulse">Carregando...</div>
      </div>
    );
  }

  // Only show "not found" after load attempt completed
  if (!currentClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Cliente não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 animate-fade-down duration-fast">
          Configuração: {currentClient.name}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1 animate-fade-up duration-normal">
          Segmento: {currentClient.segment === 'delivery' ? 'Delivery' : 'Vestuário'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6">
          <div className="flex overflow-x-auto space-x-4 sm:space-x-8 -mb-px">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap animate-fade-right duration-very-fast ${
                activeTab === 'catalog'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cardápio/Catálogo
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap animate-fade-right duration-fast ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mensagens
            </button>
            <button
              onClick={() => setActiveTab('hours')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap animate-fade-right duration-normal ${
                activeTab === 'hours'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Horário de Funcionamento
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap animate-fade-right duration-light-slow ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pagamentos
            </button>
            <button
              onClick={() => setActiveTab('costs')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap animate-fade-right duration-slow ${
                activeTab === 'costs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Custos
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'catalog' && <CatalogEditor client={currentClient} />}
        {activeTab === 'messages' && <MessagesEditor client={currentClient} />}
        {activeTab === 'hours' && <HoursEditor client={currentClient} />}
        {activeTab === 'payments' && <PaymentMethodsEditor client={currentClient} />}
        {activeTab === 'costs' && <CostsEditor client={currentClient} />}
      </div>
    </div>
  );
};

export default ClientConfig;
