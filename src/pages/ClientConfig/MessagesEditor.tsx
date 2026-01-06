// Messages Editor - Edit custom bot messages

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CustomMessages } from '../../types';

interface Props {
  client: Client;
}

const MessagesEditor = ({ client }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<CustomMessages>(
    client.configuration.messages || {}
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    const updatedConfiguration = {
      ...client.configuration,
      messages
    };

    await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    setHasChanges(false);
  };

  const updateMessage = (field: keyof CustomMessages, value: string) => {
    setMessages({
      ...messages,
      [field]: value
    });
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Mensagens Personalizadas
        </h2>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Salvar Alterações
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Greeting Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem de Saudação
          </label>
          <textarea
            value={messages.greeting || ''}
            onChange={(e) => updateMessage('greeting', e.target.value)}
            placeholder="Olá! Bem-vindo! 😊"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mensagem exibida quando o cliente inicia uma conversa
          </p>
        </div>

        {/* Confirmation Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem de Confirmação
          </label>
          <textarea
            value={messages.confirmation || ''}
            onChange={(e) => updateMessage('confirmation', e.target.value)}
            placeholder="Pedido confirmado! 🎉"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mensagem exibida após confirmação do pedido
          </p>
        </div>

        {/* Farewell Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem de Despedida
          </label>
          <textarea
            value={messages.farewell || ''}
            onChange={(e) => updateMessage('farewell', e.target.value)}
            placeholder="Em breve estará a caminho. Obrigado!"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mensagem final após pedido confirmado
          </p>
        </div>

        {/* Fallback Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem de Fallback
          </label>
          <textarea
            value={messages.fallback || ''}
            onChange={(e) => updateMessage('fallback', e.target.value)}
            placeholder="Desculpe, não entendi. Pode reformular?"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Mensagem exibida quando o bot não entende a entrada do cliente
          </p>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Prévia
        </h3>
        <div className="space-y-2">
          {messages.greeting && (
            <div className="text-sm text-gray-800">
              <span className="font-medium">Saudação:</span> {messages.greeting}
            </div>
          )}
          {messages.confirmation && (
            <div className="text-sm text-gray-800">
              <span className="font-medium">Confirmação:</span> {messages.confirmation}
            </div>
          )}
          {messages.farewell && (
            <div className="text-sm text-gray-800">
              <span className="font-medium">Despedida:</span> {messages.farewell}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesEditor;
