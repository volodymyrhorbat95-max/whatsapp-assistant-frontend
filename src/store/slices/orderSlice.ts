import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { Order, OrderStatus, OrderUpdateResponse } from '../../types';
import { AppDispatch } from '../index';
import { apiGet, apiPut } from '../../utils/api';

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
  OrderUpdateResponse,
  { orderId: number; status: OrderStatus; notifyCustomer?: boolean; clientId: number },
  { dispatch: AppDispatch }
>(
  'orders/updateStatus',
  async ({ orderId, status, notifyCustomer = true, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const response = await apiPut(`/orders/${orderId}/status`, { status, notifyCustomer, clientId });

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
      const response = await apiGet(`/orders/${orderId}`);

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
