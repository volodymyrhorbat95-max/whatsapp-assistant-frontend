import { useState } from 'react';
import { Button, MenuItem, TextField, Alert } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { ConversationWithMessages, OrderStatus, OrderUpdateResponse } from '../../types';
import { useAppDispatch } from '../../store/hooks';
import { updateOrderStatus } from '../../store/slices/orderSlice';
import { fetchConversationById } from '../../store/slices/conversationSlice';

interface Props {
  conversation: ConversationWithMessages;
}

// Status labels in Brazilian Portuguese
const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  out_for_delivery: 'Saiu para Entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

// Status icons
const STATUS_ICONS: Record<OrderStatus, JSX.Element> = {
  pending: <PendingIcon fontSize="small" />,
  confirmed: <CheckCircleIcon fontSize="small" />,
  preparing: <RestaurantIcon fontSize="small" />,
  out_for_delivery: <DirectionsCarIcon fontSize="small" />,
  delivered: <LocalShippingIcon fontSize="small" />,
  cancelled: <CancelIcon fontSize="small" />
};

// Status colors
const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const ConversationDetail = ({ conversation }: Props) => {
  const dispatch = useAppDispatch();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');
  const [notifyCustomer, setNotifyCustomer] = useState(true);

  // Bug #5 Fix: Track notification status
  const [notificationMessage, setNotificationMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    text: string;
  } | null>(null);

  // Format date to PT-BR
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle order status update
  const handleStatusUpdate = async () => {
    if (!conversation.order || !selectedStatus) return;

    const result = await dispatch(updateOrderStatus({
      orderId: conversation.order.id,
      status: selectedStatus,
      notifyCustomer,
      clientId: conversation.clientId  // CRITICAL: Include clientId for security validation
    }));

    // Bug #5 Fix: Display notification status feedback with proper typing
    if (result.payload && typeof result.payload === 'object' && 'notification' in result.payload) {
      const response = result.payload as OrderUpdateResponse;
      if (response.notification.status === 'sent') {
        setNotificationMessage({
          type: 'success',
          text: 'Status atualizado e cliente notificado via WhatsApp!'
        });
      } else if (response.notification.status === 'failed') {
        setNotificationMessage({
          type: 'warning',
          text: `Status atualizado, mas falha ao notificar cliente: ${response.notification.error || 'Erro desconhecido'}`
        });
      } else {
        setNotificationMessage({
          type: 'success',
          text: 'Status atualizado com sucesso!'
        });
      }

      // Clear message after 5 seconds
      setTimeout(() => setNotificationMessage(null), 5000);
    }

    // Refresh conversation to get updated order
    dispatch(fetchConversationById(conversation.id));
    setSelectedStatus('');
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <div className="animate-fade-right duration-very-fast">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {conversation.customerPhone}
            </h2>
            {conversation.client && (
              <p className="text-xs sm:text-sm text-gray-600">{conversation.client.name}</p>
            )}
          </div>
          <div className="text-left sm:text-right text-xs sm:text-sm text-gray-500 animate-fade-left duration-fast">
            <p>Iniciada: {formatDate(conversation.startedAt)}</p>
            <p>Status: {conversation.status}</p>
            {conversation.transferReason && (
              <p className="text-yellow-600">Motivo: {conversation.transferReason}</p>
            )}
          </div>
        </div>

        {/* Order Status Management */}
        {conversation.order && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 animate-zoom-in duration-normal">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="animate-fade-right duration-fast">
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 mb-2">
                  Pedido #{conversation.order.id}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[conversation.order.status]}`}>
                    {STATUS_ICONS[conversation.order.status]}
                    {STATUS_LABELS[conversation.order.status]}
                  </span>
                </div>
                {conversation.order.totalAmount && (
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Total:</span> R$ {Number(conversation.order.totalAmount).toFixed(2)}
                  </p>
                )}
                {conversation.order.paymentMethod && (
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Pagamento:</span> {conversation.order.paymentMethod === 'pix' ? 'Pix' : conversation.order.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}
                  </p>
                )}
                {conversation.order.deliveryAddress && (
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Endereço:</span> {conversation.order.deliveryAddress}
                  </p>
                )}
              </div>

              {/* Status Update Controls */}
              <div className="flex flex-col gap-2 w-full sm:w-auto animate-fade-left duration-light-slow">
                <TextField
                  select
                  label="Atualizar Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                  size="small"
                  fullWidth
                  sx={{ minWidth: { sm: '180px' } }}
                  className="animate-fade-down duration-normal"
                >
                  <MenuItem value="">Selecione...</MenuItem>
                  <MenuItem value="pending">Pendente</MenuItem>
                  <MenuItem value="confirmed">Confirmado</MenuItem>
                  <MenuItem value="preparing">Preparando</MenuItem>
                  <MenuItem value="out_for_delivery">Saiu para Entrega</MenuItem>
                  <MenuItem value="delivered">Entregue</MenuItem>
                  <MenuItem value="cancelled">Cancelado</MenuItem>
                </TextField>

                <label className="flex items-center gap-2 text-xs sm:text-sm text-blue-800 animate-fade-up duration-light-slow">
                  <input
                    type="checkbox"
                    checked={notifyCustomer}
                    onChange={(e) => setNotifyCustomer(e.target.checked)}
                    className="rounded"
                  />
                  Notificar cliente via WhatsApp
                </label>

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleStatusUpdate}
                  disabled={!selectedStatus}
                  fullWidth
                  className="animate-fade-up duration-slow"
                >
                  Atualizar
                </Button>

                {/* Bug #5 Fix: Display notification status feedback */}
                {notificationMessage && (
                  <Alert
                    severity={notificationMessage.type}
                    onClose={() => setNotificationMessage(null)}
                    className="text-xs animate-fade-up duration-fast"
                  >
                    {notificationMessage.text}
                  </Alert>
                )}
              </div>
            </div>

            {/* Order Items */}
            {conversation.order.items && conversation.order.items.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200 animate-fade-up duration-slow">
                <h4 className="text-xs font-semibold text-blue-800 mb-2">Itens do Pedido:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {conversation.order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {item.quantity}x {item.name}
                        {item.size && ` - ${item.size}`}
                        {item.color && ` - ${item.color}`}
                        {item.gender && ` (${item.gender === 'masculino' ? 'Masc' : item.gender === 'feminino' ? 'Fem' : ''})`}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Collected Data (when no order yet) */}
        {!conversation.order && conversation.collectedData && Object.keys(conversation.collectedData).length > 0 && (
          <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-sm animate-fade-up duration-normal">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Dados Coletados:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              {conversation.collectedData.items && conversation.collectedData.items.length > 0 && (
                <div>
                  <span className="font-medium">Itens:</span>
                  <ul className="ml-4 list-disc">
                    {conversation.collectedData.items.map((item, idx) => (
                      <li key={idx}>{item.name} - R$ {item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {conversation.collectedData.product && (
                <div>
                  <span className="font-medium">Produto:</span> {conversation.collectedData.product.name}
                  {conversation.collectedData.product.size && ` - Tamanho: ${conversation.collectedData.product.size}`}
                  {conversation.collectedData.product.color && ` - Cor: ${conversation.collectedData.product.color}`}
                  {conversation.collectedData.product.price && ` - R$ ${conversation.collectedData.product.price.toFixed(2)}`}
                </div>
              )}
              {conversation.collectedData.address && (
                <p><span className="font-medium">Endereço:</span> {conversation.collectedData.address}</p>
              )}
              {conversation.collectedData.deliveryType && (
                <p><span className="font-medium">Tipo de entrega:</span> {conversation.collectedData.deliveryType === 'delivery' ? 'Entrega' : 'Retirar na loja'}</p>
              )}
              {conversation.collectedData.paymentMethod && (
                <p><span className="font-medium">Pagamento:</span> {conversation.collectedData.paymentMethod === 'pix' ? 'Pix' : conversation.collectedData.paymentMethod === 'card' ? 'Cartão' : 'Dinheiro'}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex animate-fade-up ${
                message.direction === 'outgoing' ? 'justify-end' : 'justify-start'
              }`}
              style={{ animationDuration: `${300 + (index % 3) * 100}ms` }}
            >
              <div
                className={`max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg rounded-sm px-3 sm:px-4 py-2 ${
                  message.direction === 'outgoing'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="break-words text-sm sm:text-base">{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    message.direction === 'outgoing'
                      ? 'text-blue-100'
                      : 'text-gray-400'
                  }`}
                >
                  {formatDate(message.createdAt)}
                  {message.messageType === 'audio' && (
                    <span className="ml-2">(Audio)</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm sm:text-base animate-fade-down duration-normal">
            <p>Nenhuma mensagem nesta conversa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationDetail;
