import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { Order, OrderStatus } from '../../types';
import { AppDispatch } from '../index';

// API URL from .env - NEVER hardcoded
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface OrderState {
  currentOrder: Order | null;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  error: null
};

// Async thunk: Update order status
export const updateOrderStatus = createAsyncThunk<
  Order,
  { orderId: number; status: OrderStatus; notifyCustomer?: boolean },
  { dispatch: AppDispatch }
>(
  'orders/updateStatus',
  async ({ orderId, status, notifyCustomer = true }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notifyCustomer })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk: Fetch order by ID
export const fetchOrderById = createAsyncThunk<
  Order,
  number,
  { dispatch: AppDispatch }
>(
  'orders/fetchById',
  async (orderId, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update order status';
      })
      // Fetch order by ID
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to fetch order';
      });
  }
});

export const { clearCurrentOrder, clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
