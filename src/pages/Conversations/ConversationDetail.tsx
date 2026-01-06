import { ConversationWithMessages } from '../../types';

interface Props {
  conversation: ConversationWithMessages;
}

const ConversationDetail = ({ conversation }: Props) => {
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

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation.customerPhone}
            </h2>
            {conversation.client && (
              <p className="text-sm text-gray-600">{conversation.client.name}</p>
            )}
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>Iniciada: {formatDate(conversation.startedAt)}</p>
            <p>Status: {conversation.status}</p>
            {conversation.transferReason && (
              <p className="text-yellow-600">Motivo: {conversation.transferReason}</p>
            )}
          </div>
        </div>

        {/* Collected Data */}
        {conversation.collectedData && Object.keys(conversation.collectedData).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Dados Coletados:</h3>
            <div className="text-xs text-gray-600 space-y-1">
              {conversation.collectedData.items && conversation.collectedData.items.length > 0 && (
                <div>
                  <span className="font-medium">Itens:</span>
                  <ul className="ml-4 list-disc">
                    {conversation.collectedData.items.map((item: any, idx: number) => (
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.direction === 'outgoing' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                  message.direction === 'outgoing'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="break-words">{message.content}</p>
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
          <div className="text-center text-gray-500">
            <p>Nenhuma mensagem nesta conversa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationDetail;
