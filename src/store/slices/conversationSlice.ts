import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { ConversationListItem, ConversationWithMessages } from '../../types';
import { AppDispatch } from '../index';
import { authenticatedFetch } from '../../utils/api';

interface ConversationState {
  list: ConversationListItem[];
  current: ConversationWithMessages | null;
  error: string | null;
}

const initialState: ConversationState = {
  list: [],
  current: null,
  error: null
};

// Async thunk: Fetch all conversations with filters
export const fetchConversations = createAsyncThunk<
  ConversationListItem[],
  { startDate?: string; endDate?: string; status?: string; converted?: string; clientId?: number } | void,
  { dispatch: AppDispatch }
>(
  'conversations/fetchAll',
  async (filters, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      let url = '/conversations';

      if (filters) {
        const params = new URLSearchParams();

        // CRITICAL: clientId is required for multi-client data isolation
        if (filters.clientId) {
          params.append('clientId', filters.clientId.toString());
        }

        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.status) params.append('status', filters.status);
        if (filters.converted) params.append('converted', filters.converted);

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      const response = await authenticatedFetch(url);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch conversations');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk: Fetch single conversation with messages
export const fetchConversationById = createAsyncThunk<
  ConversationWithMessages,
  number,
  { dispatch: AppDispatch }
>(
  'conversations/fetchById',
  async (id, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await authenticatedFetch(`/conversations/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch conversation');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const conversationSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    clearCurrentConversation: (state) => {
      state.current = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all conversations
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch conversations';
      })
      // Fetch single conversation
      .addCase(fetchConversationById.fulfilled, (state, action) => {
        state.current = action.payload;
        state.error = null;
      })
      .addCase(fetchConversationById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch conversation';
      });
  }
});

export const { clearCurrentConversation, clearError } = conversationSlice.actions;
export default conversationSlice.reducer;
