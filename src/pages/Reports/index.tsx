import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchOverviewMetrics,
  fetchPaymentMethods,
  fetchPeakHours,
  fetchTopItems,
  fetchFinancialHealth,
  exportCSV
} from '../../store/slices/reportsSlice';
import { fetchClients } from '../../store/slices/clientSlice';
import OverviewCards from './OverviewCards';
import PaymentMethodsChart from './PaymentMethodsChart';
import PeakHoursChart from './PeakHoursChart';
import TopItemsList from './TopItemsList';
import DateRangePicker from './DateRangePicker';
import FinancialHealthCard from './FinancialHealthCard';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, paymentMethods, peakHours, topItems, financialHealth } = useSelector((state: RootState) => state.reports);
  const { clients } = useSelector((state: RootState) => state.client);
  const loading = useSelector((state: RootState) => state.loading.isLoading);

  // Default date range: last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');

  // Memoize loadReports to prevent unnecessary re-renders
  const loadReports = useCallback(() => {
    // CRITICAL: Data isolation - REQUIRE clientId for all queries
    if (!selectedClientId) {
      return; // Cannot load reports without client selection
    }

    const params = { startDate, endDate, clientId: selectedClientId as number };
    dispatch(fetchOverviewMetrics(params));
    dispatch(fetchPaymentMethods(params));
    dispatch(fetchPeakHours(params));
    dispatch(fetchTopItems(params));
    dispatch(fetchFinancialHealth({ startDate, endDate, clientId: selectedClientId as number }));
  }, [startDate, endDate, selectedClientId, dispatch]);

  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  // Auto-select first client when clients load
  useEffect(() => {
    if (clients.length > 0 && !selectedClientId) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  // Load reports when client is selected
  useEffect(() => {
    if (selectedClientId) {
      loadReports();
    }
  }, [loadReports, selectedClientId]);

  const handleApplyFilters = () => {
    loadReports();
  };

  const handleExportCSV = () => {
    // CRITICAL: Data isolation - REQUIRE clientId for CSV export
    if (!selectedClientId) {
      return; // Cannot export without client selection
    }
    dispatch(exportCSV({ startDate, endDate, clientId: selectedClientId as number }));
  };

  if (loading) {
    return null; // Global spinner will show
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 animate-fade-down duration-very-fast">Relatórios</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 animate-fade-down duration-fast">Métricas e análises de conversas</p>
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 animate-fade-up duration-normal">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-end">
            {/* Client Selector */}
            {/* CRITICAL: Client selection required for data isolation */}
            <FormControl size="small" fullWidth className="animate-fade-right duration-very-fast">
              <InputLabel id="client-select-label">Cliente</InputLabel>
              <Select
                labelId="client-select-label"
                value={selectedClientId}
                label="Cliente"
                onChange={(e) => setSelectedClientId(e.target.value as number | '')}
              >
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range Picker Inline */}
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              onApply={handleApplyFilters}
              onExport={handleExportCSV}
            />
          </div>
        </div>

        {/* Overview Cards */}
        {overview && <OverviewCards metrics={overview} />}

        {/* Financial Health Card - Only shown when client is selected */}
        {financialHealth && selectedClientId && (
          <FinancialHealthCard data={financialHealth} />
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Payment Methods Chart */}
          {paymentMethods.length > 0 && (
            <div className="animate-fade-right duration-slow">
              <PaymentMethodsChart data={paymentMethods} />
            </div>
          )}

          {/* Peak Hours Chart */}
          {peakHours.length > 0 && (
            <div className="animate-fade-left duration-slow">
              <PeakHoursChart data={peakHours} />
            </div>
          )}
        </div>

        {/* Top Items List */}
        {topItems.length > 0 && (
          <div className="animate-fade-up duration-very-slow">
            <TopItemsList items={topItems} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
