// Reports Slice - Redux state management for metrics and analytics

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { AppDispatch } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export interface OverviewMetrics {
  conversationsStarted: number;
  conversions: number;
  abandonments: number;
  averageTicket: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  count: number;
}

export interface PeakHour {
  hour: number;
  count: number;
}

export interface TopItem {
  name: string;
  count: number;
}

interface ReportsState {
  overview: OverviewMetrics | null;
  paymentMethods: PaymentMethodBreakdown[];
  peakHours: PeakHour[];
  topItems: TopItem[];
  error: string | null;
}

const initialState: ReportsState = {
  overview: null,
  paymentMethods: [],
  peakHours: [],
  topItems: [],
  error: null
};

interface FetchReportsParams {
  startDate: string;
  endDate: string;
  clientId?: number;
}

// Fetch overview metrics
export const fetchOverviewMetrics = createAsyncThunk<
  OverviewMetrics,
  FetchReportsParams,
  { dispatch: AppDispatch }
>(
  'reports/fetchOverviewMetrics',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (clientId) params.append('clientId', clientId.toString());

      const response = await fetch(`${API_BASE_URL}/reports/overview?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch overview metrics');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch payment methods breakdown
export const fetchPaymentMethods = createAsyncThunk<
  PaymentMethodBreakdown[],
  FetchReportsParams,
  { dispatch: AppDispatch }
>(
  'reports/fetchPaymentMethods',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (clientId) params.append('clientId', clientId.toString());

      const response = await fetch(`${API_BASE_URL}/reports/payment-methods?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch peak hours
export const fetchPeakHours = createAsyncThunk<
  PeakHour[],
  FetchReportsParams,
  { dispatch: AppDispatch }
>(
  'reports/fetchPeakHours',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (clientId) params.append('clientId', clientId.toString());

      const response = await fetch(`${API_BASE_URL}/reports/peak-hours?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch peak hours');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Fetch top items
export const fetchTopItems = createAsyncThunk<
  TopItem[],
  FetchReportsParams,
  { dispatch: AppDispatch }
>(
  'reports/fetchTopItems',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (clientId) params.append('clientId', clientId.toString());

      const response = await fetch(`${API_BASE_URL}/reports/top-items?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch top items');
      }
      return await response.json();
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Export CSV
export const exportCSV = createAsyncThunk<
  void,
  FetchReportsParams,
  { dispatch: AppDispatch }
>(
  'reports/exportCSV',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({ startDate, endDate });
      if (clientId) params.append('clientId', clientId.toString());

      const response = await fetch(`${API_BASE_URL}/reports/export-csv?${params}`);
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'relatorio.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } finally {
      dispatch(setLoading(false));
    }
  }
);

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReports: (state) => {
      state.overview = null;
      state.paymentMethods = [];
      state.peakHours = [];
      state.topItems = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch overview metrics
    builder.addCase(fetchOverviewMetrics.fulfilled, (state, action: PayloadAction<OverviewMetrics>) => {
      state.overview = action.payload;
    });
    builder.addCase(fetchOverviewMetrics.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch overview metrics';
    });

    // Fetch payment methods
    builder.addCase(fetchPaymentMethods.fulfilled, (state, action: PayloadAction<PaymentMethodBreakdown[]>) => {
      state.paymentMethods = action.payload;
    });
    builder.addCase(fetchPaymentMethods.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch payment methods';
    });

    // Fetch peak hours
    builder.addCase(fetchPeakHours.fulfilled, (state, action: PayloadAction<PeakHour[]>) => {
      state.peakHours = action.payload;
    });
    builder.addCase(fetchPeakHours.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch peak hours';
    });

    // Fetch top items
    builder.addCase(fetchTopItems.fulfilled, (state, action: PayloadAction<TopItem[]>) => {
      state.topItems = action.payload;
    });
    builder.addCase(fetchTopItems.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch top items';
    });

    // Export CSV
    builder.addCase(exportCSV.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to export CSV';
    });
  }
});

export const { clearReports, clearError } = reportsSlice.actions;
export default reportsSlice.reducer;
