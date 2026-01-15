// Client Slice - Redux state management for client data and configuration

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { Client, ClientConfiguration, ClientSegment } from '../../types';
import { AppDispatch } from '../index';
import { apiGet, apiPost, apiPut } from '../../utils/api';

interface ClientState {
  clients: Client[];
  currentClient: Client | null;
  error: string | null;
}

const initialState: ClientState = {
  clients: [],
  currentClient: null,
  error: null
};

// Fetch all clients
export const fetchClients = createAsyncThunk<
  Client[],
  void,
  { dispatch: AppDispatch }
>(
  'client/fetchClients',
  async (_, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await apiGet('/clients');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch clients');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch single client by ID
export const fetchClient = createAsyncThunk<
  Client,
  number,
  { dispatch: AppDispatch }
>(
  'client/fetchClient',
  async (clientId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await apiGet(`/clients/${clientId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch client');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create new client
// segment must be 'delivery' or 'clothing' - enforced by ClientSegment type
export const createClient = createAsyncThunk<
  Client,
  { name: string; segment: ClientSegment; whatsappNumber: string; configuration?: ClientConfiguration },
  { dispatch: AppDispatch }
>(
  'client/createClient',
  async ({ name, segment, whatsappNumber, configuration }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await apiPost('/clients', { name, segment, whatsappNumber, configuration });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create client');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Update client configuration
export const updateClient = createAsyncThunk<
  Client,
  { clientId: number; configuration: ClientConfiguration },
  { dispatch: AppDispatch }
>(
  'client/updateClient',
  async ({ clientId, configuration }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await apiPut(`/clients/${clientId}`, { configuration });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearCurrentClient: (state) => {
      state.currentClient = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all clients
    builder.addCase(fetchClients.fulfilled, (state, action: PayloadAction<Client[]>) => {
      state.clients = action.payload;
    });
    builder.addCase(fetchClients.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch clients';
    });

    // Fetch single client
    builder.addCase(fetchClient.fulfilled, (state, action: PayloadAction<Client>) => {
      state.currentClient = action.payload;
    });
    builder.addCase(fetchClient.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch client';
    });

    // Create new client
    builder.addCase(createClient.fulfilled, (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
      state.currentClient = action.payload;
    });
    builder.addCase(createClient.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to create client';
    });

    // Update client configuration
    builder.addCase(updateClient.fulfilled, (state, action: PayloadAction<Client>) => {
      state.currentClient = action.payload;
      // Update in clients list if present
      const index = state.clients.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.clients[index] = action.payload;
      }
    });
    builder.addCase(updateClient.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to update client';
    });
  }
});

export const { clearCurrentClient, clearError } = clientSlice.actions;
export default clientSlice.reducer;
