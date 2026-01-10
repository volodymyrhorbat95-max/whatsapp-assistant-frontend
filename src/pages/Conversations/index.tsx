import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchConversations } from '../../store/slices/conversationSlice';
import ConversationList from './ConversationList';
import ConversationDetail from './ConversationDetail';
import ConversationFilters from './ConversationFilters';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const ConversationsPage = () => {
  const dispatch = useAppDispatch();
  const { list, current } = useAppSelector((state) => state.conversations);

  // Filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');
  const [converted, setConverted] = useState('');

  // Page load → dispatch Redux action
  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  const handleApplyFilters = () => {
    dispatch(fetchConversations({ startDate, endDate, status, converted }));
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatus('');
    setConverted('');
    dispatch(fetchConversations());
  };

  // useSelector reads data → UI renders
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar - Conversation List */}
      <div className="@container w-full md:w-1/3 bg-white border-b md:border-b-0 md:border-r border-gray-200 overflow-hidden flex flex-col max-h-[50vh] md:max-h-none">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 animate-fade-down duration-very-fast">Conversas</h1>
          <p className="text-xs sm:text-sm text-gray-500 animate-fade-down duration-fast">{list.length} conversas</p>
        </div>
        <ConversationFilters
          startDate={startDate}
          endDate={endDate}
          status={status}
          converted={converted}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onStatusChange={setStatus}
          onConvertedChange={setConverted}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />
        <div className="flex-1 overflow-y-auto">
          <ConversationList conversations={list} />
        </div>
      </div>

      {/* Main Content - Conversation Detail */}
      <div className="flex-1 flex flex-col">
        {current ? (
          <ConversationDetail conversation={current} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            <div className="text-center">
              <ChatBubbleOutlineIcon
                className="mx-auto animate-zoom-in duration-normal"
                sx={{ fontSize: { xs: 40, sm: 48 }, color: 'rgba(156, 163, 175, 1)' }}
              />
              <p className="mt-2 text-sm sm:text-base animate-fade-up duration-light-slow">Selecione uma conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
