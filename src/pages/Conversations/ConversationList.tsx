import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchConversationById } from '../../store/slices/conversationSlice';
import { ConversationListItem } from '../../types';

interface Props {
  conversations: ConversationListItem[];
}

const ConversationList = ({ conversations }: Props) => {
  const dispatch = useAppDispatch();
  const { current } = useAppSelector((state) => state.conversations);

  // Button click → dispatch Redux action
  const handleClick = (id: number) => {
    dispatch(fetchConversationById(id));
  };

  // Format date to PT-BR
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'abandoned':
        return 'bg-yellow-100 text-yellow-800';
      case 'transferred':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label in PT-BR
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'Em andamento';
      case 'completed':
        return 'Concluída';
      case 'abandoned':
        return 'Abandonada';
      case 'transferred':
        return 'Transferida';
      default:
        return status;
    }
  };

  const animationDirections = ['fade-up', 'fade-right', 'zoom-in', 'flip-up'];
  const animationDurations = ['very-fast', 'fast', 'normal', 'light-slow', 'slow'];

  if (conversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 animate-fade-down duration-normal">
        Nenhuma conversa encontrada
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conv, index) => {
        const direction = animationDirections[index % animationDirections.length];
        const duration = animationDurations[index % animationDurations.length];

        return (
          <div
            key={conv.id}
            onClick={() => handleClick(conv.id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors animate-${direction} duration-${duration} ${
              current?.id === conv.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="font-medium text-gray-900">{conv.customerPhone}</div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conv.status)}`}
              >
                {getStatusLabel(conv.status)}
              </span>
            </div>
            {conv.client && (
              <div className="text-sm text-gray-600 mt-1">{conv.client.name}</div>
            )}
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(conv.lastMessageAt)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
