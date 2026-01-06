import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchConversations } from '../../store/slices/conversationSlice';
import ConversationList from './ConversationList';
import ConversationDetail from './ConversationDetail';
import ConversationFilters from './ConversationFilters';

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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Conversation List */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Conversas</h1>
          <p className="text-sm text-gray-500">{list.length} conversas</p>
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
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="mt-2">Selecione uma conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;
