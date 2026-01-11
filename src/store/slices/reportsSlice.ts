// Reports Slice - Redux state management for metrics and analytics

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoading } from './loadingSlice';
import { AppDispatch } from '../index';
import { authenticatedFetch } from '../../utils/api';

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

export interface FinancialHealth {
  totalRevenue: number;
  fixedCosts: number;
  variableCosts: number;
  estimatedProfit: number;
  profitMargin: number;
  orderCount: number;
}

interface ReportsState {
  overview: OverviewMetrics | null;
  paymentMethods: PaymentMethodBreakdown[];
  peakHours: PeakHour[];
  topItems: TopItem[];
  financialHealth: FinancialHealth | null;
  error: string | null;
}

const initialState: ReportsState = {
  overview: null,
  paymentMethods: [],
  peakHours: [],
  topItems: [],
  financialHealth: null,
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

      const response = await authenticatedFetch(`/reports/overview?${params}`);
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

      const response = await authenticatedFetch(`/reports/payment-methods?${params}`);
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

      const response = await authenticatedFetch(`/reports/peak-hours?${params}`);
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

      const response = await authenticatedFetch(`/reports/top-items?${params}`);
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

      const response = await authenticatedFetch(`/reports/export-csv?${params}`);
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

// Fetch financial health (requires clientId)
export const fetchFinancialHealth = createAsyncThunk<
  FinancialHealth,
  { startDate: string; endDate: string; clientId: number },
  { dispatch: AppDispatch }
>(
  'reports/fetchFinancialHealth',
  async ({ startDate, endDate, clientId }, { dispatch }) => {
    dispatch(setLoading(true));
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        clientId: clientId.toString()
      });

      const response = await authenticatedFetch(`/reports/financial-health?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch financial health');
      }
      return await response.json();
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
      state.financialHealth = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearFinancialHealth: (state) => {
      state.financialHealth = null;
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

    // Fetch financial health
    builder.addCase(fetchFinancialHealth.fulfilled, (state, action: PayloadAction<FinancialHealth>) => {
      state.financialHealth = action.payload;
    });
    builder.addCase(fetchFinancialHealth.rejected, (state, action) => {
      state.error = action.error.message || 'Failed to fetch financial health';
    });
  }
});

export const { clearReports, clearError, clearFinancialHealth } = reportsSlice.actions;
export default reportsSlice.reducer;
