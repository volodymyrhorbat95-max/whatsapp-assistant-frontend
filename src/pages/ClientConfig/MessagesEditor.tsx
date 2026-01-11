// Messages Editor - Edit custom bot messages

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CustomMessages } from '../../types';
import { Button, TextField, Alert } from '@mui/material';

interface Props {
  client: Client;
}

const MessagesEditor = ({ client }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [messages, setMessages] = useState<CustomMessages>(
    client.configuration.messages || {}
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const updatedConfiguration = {
      ...client.configuration,
      messages
    };

    const result = await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    // ✅ Check if action succeeded
    if (updateClient.fulfilled.match(result)) {
      setSuccess('Mensagens salvas com sucesso!');
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error?.message || 'Falha ao salvar mensagens');
    }
  };

  const updateMessage = (field: keyof CustomMessages, value: string) => {
    setMessages({
      ...messages,
      [field]: value
    });
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 animate-fade-down duration-very-fast">
          Mensagens Personalizadas
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
        <TextField
          label="Mensagem de Saudação"
          value={messages.greeting || ''}
          onChange={(e) => updateMessage('greeting', e.target.value)}
          placeholder="Olá! Bem-vindo! 😊"
          multiline
          rows={3}
          fullWidth
          helperText="Mensagem exibida quando o cliente inicia uma conversa"
          className="animate-fade-right duration-very-fast"
        />

        <TextField
          label="Mensagem de Confirmação"
          value={messages.confirmation || ''}
          onChange={(e) => updateMessage('confirmation', e.target.value)}
          placeholder="Pedido confirmado! 🎉"
          multiline
          rows={3}
          fullWidth
          helperText="Mensagem exibida após confirmação do pedido"
          className="animate-fade-right duration-fast"
        />

        <TextField
          label="Mensagem de Despedida"
          value={messages.farewell || ''}
          onChange={(e) => updateMessage('farewell', e.target.value)}
          placeholder="Em breve estará a caminho. Obrigado!"
          multiline
          rows={3}
          fullWidth
          helperText="Mensagem final após pedido confirmado"
          className="animate-fade-right duration-normal"
        />

        <TextField
          label="Mensagem de Fallback"
          value={messages.fallback || ''}
          onChange={(e) => updateMessage('fallback', e.target.value)}
          placeholder="Desculpe, não entendi. Pode reformular?"
          multiline
          rows={3}
          fullWidth
          helperText="Mensagem exibida quando o bot não entende a entrada do cliente"
          className="animate-fade-right duration-light-slow"
        />

        <TextField
          label="Mensagem de Fechado"
          value={messages.closedMessage || ''}
          onChange={(e) => updateMessage('closedMessage', e.target.value)}
          placeholder="Olá! No momento estamos fechados. Deixe sua mensagem que retornaremos em breve!"
          multiline
          rows={3}
          fullWidth
          helperText="Mensagem exibida quando o cliente envia mensagem fora do horário de funcionamento"
          className="animate-fade-right duration-slow"
        />
      </div>

      {/* Preview */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-sm animate-fade-up duration-slow">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Prévia
        </h3>
        <div className="space-y-2">
          {messages.greeting && (
            <div className="text-xs sm:text-sm text-gray-800">
              <span className="font-medium">Saudação:</span> {messages.greeting}
            </div>
          )}
          {messages.confirmation && (
            <div className="text-xs sm:text-sm text-gray-800">
              <span className="font-medium">Confirmação:</span> {messages.confirmation}
            </div>
          )}
          {messages.farewell && (
            <div className="text-xs sm:text-sm text-gray-800">
              <span className="font-medium">Despedida:</span> {messages.farewell}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesEditor;
