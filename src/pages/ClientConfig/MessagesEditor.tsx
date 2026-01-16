// Messages Editor - Edit ALL custom bot messages
// CRITICAL: Every bot response must be configurable (Predictable, Deterministic Responses requirement)

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, CustomMessages } from '../../types';
import { Button, TextField, Alert, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
  client: Client;
}

// Message field definition for UI rendering
interface MessageFieldDef {
  key: keyof CustomMessages;
  label: string;
  placeholder: string;
  helperText: string;
}

// Group messages by category for organized UI
const coreMessages: MessageFieldDef[] = [
  {
    key: 'greeting',
    label: 'Mensagem de Saudação',
    placeholder: 'Olá! Bem-vindo! 😊',
    helperText: 'Mensagem exibida quando o cliente inicia uma conversa'
  },
  {
    key: 'confirmation',
    label: 'Mensagem de Confirmação',
    placeholder: 'Pedido confirmado! 🎉',
    helperText: 'Mensagem exibida após confirmação do pedido'
  },
  {
    key: 'farewell',
    label: 'Mensagem de Despedida',
    placeholder: 'Em breve estará a caminho. Obrigado!',
    helperText: 'Mensagem final após pedido confirmado'
  },
  {
    key: 'fallback',
    label: 'Mensagem de Fallback',
    placeholder: 'Desculpe, não entendi. Pode reformular?',
    helperText: 'Mensagem exibida quando o bot não entende a entrada do cliente'
  },
  {
    key: 'closedMessage',
    label: 'Mensagem de Fechado',
    placeholder: 'Olá! No momento estamos fechados. Deixe sua mensagem que retornaremos em breve!',
    helperText: 'Mensagem exibida quando o cliente envia mensagem fora do horário de funcionamento'
  },
  {
    key: 'closedMessageWithHours',
    label: 'Mensagem de Fechado (com horário)',
    placeholder: 'Olá! No momento estamos fechados. Nosso horário é das {open} às {close}. Deixe sua mensagem!',
    helperText: 'Mensagem com horário dinâmico. Use {open} e {close} para os horários do dia.'
  }
];

// Order status notification messages (sent when business updates order status)
const statusNotificationMessages: MessageFieldDef[] = [
  {
    key: 'statusPending',
    label: 'Pedido Pendente',
    placeholder: 'Seu pedido está pendente.',
    helperText: 'Notificação quando pedido está pendente'
  },
  {
    key: 'statusConfirmed',
    label: 'Pedido Confirmado',
    placeholder: 'Seu pedido foi confirmado!',
    helperText: 'Notificação quando pedido é confirmado'
  },
  {
    key: 'statusPreparing',
    label: 'Pedido em Preparo',
    placeholder: 'Seu pedido está sendo preparado! 🍳',
    helperText: 'Notificação quando pedido está sendo preparado'
  },
  {
    key: 'statusOutForDelivery',
    label: 'Pedido Saiu para Entrega',
    placeholder: 'Seu pedido saiu para entrega! 🚗',
    helperText: 'Notificação quando pedido saiu para entrega'
  },
  {
    key: 'statusDelivered',
    label: 'Pedido Entregue',
    placeholder: 'Seu pedido foi entregue! Obrigado pela preferência! 🎉',
    helperText: 'Notificação quando pedido foi entregue'
  },
  {
    key: 'statusCancelled',
    label: 'Pedido Cancelado',
    placeholder: 'Seu pedido foi cancelado.',
    helperText: 'Notificação quando pedido é cancelado'
  }
];

const transferMessages: MessageFieldDef[] = [
  {
    key: 'transferToHuman',
    label: 'Transferência para Humano',
    placeholder: 'Vou te conectar com um atendente agora. Um momento, por favor.',
    helperText: 'Mensagem ao transferir para atendimento humano'
  },
  {
    key: 'exchangeReturnTransfer',
    label: 'Transferência Troca/Devolução',
    placeholder: 'Vou te conectar com um atendente para te ajudar com isso.',
    helperText: 'Mensagem ao detectar pedido de troca ou devolução'
  },
  {
    key: 'alreadyWithAgent',
    label: 'Já com Atendente',
    placeholder: 'Você já está em contato com um atendente. Aguarde um momento.',
    helperText: 'Mensagem quando cliente já está em atendimento humano'
  },
  {
    key: 'systemError',
    label: 'Erro do Sistema',
    placeholder: 'Desculpe, ocorreu um erro. Vou te conectar com um atendente.',
    helperText: 'Mensagem quando ocorre erro inesperado no sistema'
  }
];

const audioErrorMessages: MessageFieldDef[] = [
  {
    key: 'audioTranscriptionFailed',
    label: 'Falha na Transcrição de Áudio',
    placeholder: 'Não consegui entender o áudio. Pode escrever?',
    helperText: 'Mensagem quando a transcrição do áudio falha'
  },
  {
    key: 'processingError',
    label: 'Erro ao Processar Mensagem',
    placeholder: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente em alguns minutos.',
    helperText: 'Mensagem quando ocorre erro ao processar mensagem do cliente'
  }
];

// Menu display messages for delivery
const menuDisplayMessages: MessageFieldDef[] = [
  {
    key: 'menuNotAvailable',
    label: 'Cardápio Indisponível',
    placeholder: 'Desculpe, o cardápio não está disponível no momento.',
    helperText: 'Mensagem quando cardápio está vazio ou indisponível'
  },
  {
    key: 'menuHeader',
    label: 'Cabeçalho do Cardápio',
    placeholder: '📋 *Nosso Cardápio:*',
    helperText: 'Texto exibido no topo do cardápio'
  },
  {
    key: 'menuFooter',
    label: 'Rodapé do Cardápio',
    placeholder: 'Qual categoria você gostaria?',
    helperText: 'Texto exibido após as categorias do cardápio'
  },
  {
    key: 'categoryNoItems',
    label: 'Categoria Sem Itens',
    placeholder: 'Desculpe, não temos itens disponíveis em {category} no momento.',
    helperText: 'Mensagem quando categoria está vazia. Use {category} para nome.'
  },
  {
    key: 'categoryItemsFooter',
    label: 'Rodapé dos Itens',
    placeholder: 'Qual você gostaria?',
    helperText: 'Texto exibido após listar itens de uma categoria'
  }
];

const deliveryFlowMessages: MessageFieldDef[] = [
  {
    key: 'askGreeting',
    label: 'Solicitar Saudação',
    placeholder: 'Olá! Para fazer um pedido, diga "oi" ou "quero fazer um pedido".',
    helperText: 'Mensagem pedindo para cliente iniciar pedido'
  },
  {
    key: 'chooseCategory',
    label: 'Escolher Categoria',
    placeholder: 'Por favor, escolha uma categoria: {categories}.',
    helperText: 'Mensagem para escolher categoria do cardápio. Use {categories} para lista dinâmica.'
  },
  {
    key: 'itemAdded',
    label: 'Item Adicionado',
    placeholder: '{item} adicionado! R$ {price}\n\nQuer mais alguma coisa?',
    helperText: 'Mensagem ao adicionar item. Use {item} e {price} para valores.'
  },
  {
    key: 'noItemsYet',
    label: 'Nenhum Item Ainda',
    placeholder: 'Você ainda não adicionou nenhum item. Qual você gostaria?',
    helperText: 'Mensagem quando cliente diz "não" mas ainda não tem itens'
  },
  {
    key: 'askAddress',
    label: 'Solicitar Endereço',
    placeholder: 'Ótimo! Qual o endereço para entrega?',
    helperText: 'Mensagem solicitando endereço de entrega'
  },
  {
    key: 'itemNotFound',
    label: 'Item Não Encontrado',
    placeholder: 'Desculpe, não encontrei esse item no cardápio. Pode tentar novamente?',
    helperText: 'Mensagem quando item não é encontrado no cardápio'
  },
  {
    key: 'addressConfirmed',
    label: 'Endereço Confirmado',
    placeholder: 'Endereço confirmado: {address}\n\nForma de pagamento: Pix, Cartão ou Dinheiro?',
    helperText: 'Mensagem confirmando endereço. Use {address} para valor.'
  },
  {
    key: 'invalidAddress',
    label: 'Endereço Inválido',
    placeholder: 'Por favor, forneça um endereço completo com número.',
    helperText: 'Mensagem quando endereço é incompleto'
  },
  {
    key: 'paymentNotAccepted',
    label: 'Pagamento Não Aceito',
    placeholder: 'Desculpe, não aceitamos {method}. Aceitamos: {accepted}.',
    helperText: 'Mensagem quando forma de pagamento não é aceita. Use {method} e {accepted}.'
  },
  {
    key: 'choosePayment',
    label: 'Escolher Pagamento',
    placeholder: 'Por favor, escolha: {methods}.',
    helperText: 'Mensagem solicitando forma de pagamento. Use {methods} para opções.'
  },
  {
    key: 'askConfirmation',
    label: 'Solicitar Confirmação',
    placeholder: 'Posso confirmar seu pedido?',
    helperText: 'Mensagem pedindo confirmação do pedido'
  },
  {
    key: 'orderCancelled',
    label: 'Pedido Cancelado',
    placeholder: 'Pedido cancelado. Se quiser fazer um novo pedido, é só me chamar!',
    helperText: 'Mensagem quando cliente cancela pedido'
  },
  {
    key: 'pleaseConfirm',
    label: 'Por Favor Confirme',
    placeholder: 'Por favor, confirme: Sim ou Não?',
    helperText: 'Mensagem pedindo resposta clara de confirmação'
  },
  {
    key: 'orderAlreadyConfirmed',
    label: 'Pedido Já Confirmado',
    placeholder: 'Seu pedido já foi confirmado! Se precisar de algo mais, é só chamar.',
    helperText: 'Mensagem quando cliente envia mensagem após confirmação'
  }
];

// Order summary labels (delivery) - CRITICAL for "Mandatory Confirmation Before Creating Orders"
const orderSummaryMessages: MessageFieldDef[] = [
  {
    key: 'orderSummaryHeader',
    label: 'Cabeçalho do Resumo',
    placeholder: '*📝 Resumo do Pedido:*',
    helperText: 'Título exibido no topo do resumo do pedido'
  },
  {
    key: 'orderSummaryItems',
    label: 'Rótulo Itens',
    placeholder: '*Itens:*',
    helperText: 'Rótulo antes da lista de itens'
  },
  {
    key: 'orderSummaryTotal',
    label: 'Rótulo Total',
    placeholder: '*Total:*',
    helperText: 'Rótulo antes do valor total'
  },
  {
    key: 'orderSummaryAddress',
    label: 'Rótulo Endereço',
    placeholder: '*Endereço:*',
    helperText: 'Rótulo antes do endereço de entrega'
  },
  {
    key: 'orderSummaryPayment',
    label: 'Rótulo Pagamento',
    placeholder: '*Pagamento:*',
    helperText: 'Rótulo antes da forma de pagamento'
  }
];

// Clothing product display messages
const clothingDisplayMessages: MessageFieldDef[] = [
  {
    key: 'optionsHeader',
    label: 'Cabeçalho de Opções',
    placeholder: 'Temos essas opções:',
    helperText: 'Texto exibido antes de listar opções de produtos'
  },
  {
    key: 'productSelected',
    label: 'Produto Selecionado',
    placeholder: 'Ótimo! {product} por R$ {price}.',
    helperText: 'Mensagem ao selecionar produto. Use {product} e {price} para valores.'
  }
];

// Reservation summary labels (clothing) - CRITICAL for "Mandatory Confirmation Before Creating Orders"
const reservationSummaryMessages: MessageFieldDef[] = [
  {
    key: 'reservationSummaryHeader',
    label: 'Cabeçalho do Resumo',
    placeholder: '📋 Resumo da Reserva:',
    helperText: 'Título exibido no topo do resumo da reserva'
  },
  {
    key: 'reservationSummaryProduct',
    label: 'Rótulo Produto',
    placeholder: '🛍️ Produto:',
    helperText: 'Rótulo antes do nome do produto'
  },
  {
    key: 'reservationSummarySize',
    label: 'Rótulo Tamanho',
    placeholder: '📏 Tamanho:',
    helperText: 'Rótulo antes do tamanho'
  },
  {
    key: 'reservationSummaryColor',
    label: 'Rótulo Cor',
    placeholder: '🎨 Cor:',
    helperText: 'Rótulo antes da cor'
  },
  {
    key: 'reservationSummaryPrice',
    label: 'Rótulo Valor',
    placeholder: '💰 Valor:',
    helperText: 'Rótulo antes do preço'
  },
  {
    key: 'reservationSummaryDelivery',
    label: 'Rótulo Entrega',
    placeholder: '📦 Entrega:',
    helperText: 'Rótulo antes do endereço de entrega'
  },
  {
    key: 'reservationSummaryPickup',
    label: 'Texto Retirada',
    placeholder: '📦 Retirar na loja',
    helperText: 'Texto exibido quando cliente vai retirar na loja'
  }
];

const clothingFlowMessages: MessageFieldDef[] = [
  {
    key: 'askProductType',
    label: 'Perguntar Tipo de Produto',
    placeholder: 'Olá! Que produto você está procurando? (Ex: camiseta, calça, vestido)',
    helperText: 'Mensagem inicial perguntando qual produto'
  },
  {
    key: 'askGender',
    label: 'Perguntar Gênero',
    placeholder: 'É masculino ou feminino?',
    helperText: 'Mensagem perguntando se é masculino ou feminino'
  },
  {
    key: 'invalidGender',
    label: 'Gênero Inválido',
    placeholder: 'Não entendi. É masculino ou feminino?',
    helperText: 'Mensagem quando não entende a resposta de gênero'
  },
  {
    key: 'askSize',
    label: 'Perguntar Tamanho',
    placeholder: 'Qual tamanho? (PP, P, M, G, GG, XG ou número)',
    helperText: 'Mensagem perguntando o tamanho'
  },
  {
    key: 'invalidSize',
    label: 'Tamanho Inválido',
    placeholder: 'Não entendi o tamanho. Pode escolher: PP, P, M, G, GG, XG ou número?',
    helperText: 'Mensagem quando não entende o tamanho'
  },
  {
    key: 'productNotAvailable',
    label: 'Produto Indisponível',
    placeholder: 'Desculpe, não temos esse produto disponível no momento. Quer procurar outro?',
    helperText: 'Mensagem quando produto não está disponível'
  },
  {
    key: 'chooseOption',
    label: 'Escolher Opção',
    placeholder: 'Qual você gostaria? (Digite o número ou nome)',
    helperText: 'Mensagem para escolher entre opções disponíveis'
  },
  {
    key: 'invalidOption',
    label: 'Opção Inválida',
    placeholder: 'Não entendi qual você quer. Pode escolher pelo número ou nome?',
    helperText: 'Mensagem quando não entende a escolha'
  },
  {
    key: 'askDeliveryType',
    label: 'Perguntar Tipo de Entrega',
    placeholder: 'Você quer retirar na loja ou entregar no seu endereço?',
    helperText: 'Mensagem perguntando se quer retirada ou entrega'
  },
  {
    key: 'invalidDeliveryType',
    label: 'Tipo de Entrega Inválido',
    placeholder: 'Não entendi. Você quer retirar na loja ou entregar no seu endereço?',
    helperText: 'Mensagem quando não entende opção de entrega'
  },
  {
    key: 'pickupConfirmed',
    label: 'Retirada Confirmada',
    placeholder: 'Certo! Você vai retirar na loja.\n\nForma de pagamento: Pix, Cartão ou Dinheiro?',
    helperText: 'Mensagem confirmando retirada na loja'
  },
  {
    key: 'reservationCancelled',
    label: 'Reserva Cancelada',
    placeholder: 'Sem problemas. Se quiser fazer outro pedido, é só chamar!',
    helperText: 'Mensagem quando cliente cancela reserva'
  },
  {
    key: 'reservationAlreadyConfirmed',
    label: 'Reserva Já Confirmada',
    placeholder: 'Sua reserva já foi confirmada. Se precisar de algo mais, é só chamar!',
    helperText: 'Mensagem quando cliente envia mensagem após confirmação de reserva'
  }
];

const MessagesEditor = ({ client }: Props) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.loading);
  const [messages, setMessages] = useState<CustomMessages>(
    client.configuration.messages || {}
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>(['core']);

  // Sync local state when client prop updates (after save)
  useEffect(() => {
    setMessages(client.configuration.messages || {});
  }, [client.configuration.messages]);

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

  const handleAccordionChange = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSections(prev =>
      isExpanded ? [...prev, panel] : prev.filter(p => p !== panel)
    );
  };

  const renderMessageField = (field: MessageFieldDef, index: number) => (
    <TextField
      key={field.key}
      label={field.label}
      value={messages[field.key] || ''}
      onChange={(e) => updateMessage(field.key, e.target.value)}
      placeholder={field.placeholder}
      multiline
      rows={2}
      fullWidth
      helperText={field.helperText}
      className={`animate-fade-right duration-${index % 2 === 0 ? 'fast' : 'normal'}`}
      sx={{ mb: 2 }}
    />
  );

  const renderSection = (
    id: string,
    title: string,
    subtitle: string,
    fields: MessageFieldDef[]
  ) => (
    <Accordion
      expanded={expandedSections.includes(id)}
      onChange={handleAccordionChange(id)}
      className="animate-fade-down duration-fast"
      sx={{ mb: 1 }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div>
          <div className="font-semibold text-gray-900">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="space-y-2">
          {fields.map((field, index) => renderMessageField(field, index))}
        </div>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 animate-fade-down duration-very-fast">
            Mensagens Personalizadas
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Configure todas as mensagens que o bot envia aos clientes
          </p>
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

      <div className="space-y-2">
        {renderSection(
          'core',
          'Mensagens Principais',
          '6 mensagens - Saudação, confirmação, despedida, fallback e fechado',
          coreMessages
        )}

        {renderSection(
          'transfer',
          'Transferência para Humano',
          '4 mensagens - Transferência, troca/devolução, já com atendente, erro',
          transferMessages
        )}

        {renderSection(
          'audio',
          'Áudio e Erros',
          '2 mensagens - Falha na transcrição e erro de processamento',
          audioErrorMessages
        )}

        {renderSection(
          'status',
          'Notificações de Status do Pedido',
          '6 mensagens - Enviadas ao cliente quando você atualiza o status do pedido',
          statusNotificationMessages
        )}

        {client.segment === 'delivery' && renderSection(
          'menu',
          'Exibição do Cardápio',
          '5 mensagens - Cabeçalho, rodapé e mensagens do cardápio',
          menuDisplayMessages
        )}

        {client.segment === 'delivery' && renderSection(
          'delivery',
          'Fluxo de Delivery',
          '14 mensagens - Todo o fluxo de pedidos de delivery',
          deliveryFlowMessages
        )}

        {client.segment === 'delivery' && renderSection(
          'orderSummary',
          'Resumo do Pedido (Confirmação)',
          '5 rótulos - Exibidos antes da confirmação obrigatória',
          orderSummaryMessages
        )}

        {client.segment === 'clothing' && renderSection(
          'clothingDisplay',
          'Exibição de Produtos',
          '2 mensagens - Cabeçalho de opções e seleção de produto',
          clothingDisplayMessages
        )}

        {client.segment === 'clothing' && renderSection(
          'reservationSummary',
          'Resumo da Reserva (Confirmação)',
          '7 rótulos - Exibidos antes da confirmação obrigatória',
          reservationSummaryMessages
        )}

        {client.segment === 'clothing' && renderSection(
          'clothing',
          'Fluxo de Loja de Roupas',
          '13 mensagens - Todo o fluxo de reservas de roupas',
          clothingFlowMessages
        )}

        {/* Show both flows if segment is not set (shouldn't happen but good fallback) */}
        {!client.segment && (
          <>
            {renderSection(
              'delivery',
              'Fluxo de Delivery',
              '14 mensagens - Todo o fluxo de pedidos de delivery',
              deliveryFlowMessages
            )}
            {renderSection(
              'clothing',
              'Fluxo de Loja de Roupas',
              '13 mensagens - Todo o fluxo de reservas de roupas',
              clothingFlowMessages
            )}
          </>
        )}
      </div>

      {/* Preview */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-sm animate-fade-up duration-slow">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
          Prévia das Mensagens Principais
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
          {messages.transferToHuman && (
            <div className="text-xs sm:text-sm text-gray-800">
              <span className="font-medium">Transferência:</span> {messages.transferToHuman}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesEditor;
