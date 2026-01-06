// Client Slice - Redux state management for client data and configuration

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { Client, ClientConfiguration } from '../../types';
import { AppDispatch } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
      const response = await fetch(`${API_BASE_URL}/clients`);
      if (!response.ok) {
        throw new Error('Failed to fetch clients');
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
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Create new client
export const createClient = createAsyncThunk<
  Client,
  { name: string; segment: string; whatsappNumber: string; configuration?: ClientConfiguration },
  { dispatch: AppDispatch }
>(
  'client/createClient',
  async ({ name, segment, whatsappNumber, configuration }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, segment, whatsappNumber, configuration })
      });
      if (!response.ok) {
        throw new Error('Failed to create client');
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
      const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ configuration })
      });
      if (!response.ok) {
        throw new Error('Failed to update client');
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
