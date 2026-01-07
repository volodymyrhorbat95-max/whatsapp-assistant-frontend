import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchOverviewMetrics,
  fetchPaymentMethods,
  fetchPeakHours,
  fetchTopItems,
  exportCSV
} from '../../store/slices/reportsSlice';
import OverviewCards from './OverviewCards';
import PaymentMethodsChart from './PaymentMethodsChart';
import PeakHoursChart from './PeakHoursChart';
import TopItemsList from './TopItemsList';
import DateRangePicker from './DateRangePicker';

const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, paymentMethods, peakHours, topItems } = useSelector((state: RootState) => state.reports);
  const loading = useSelector((state: RootState) => state.loading.isLoading);

  // Default date range: last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState<string>(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(today.toISOString().split('T')[0]);

  const loadReports = () => {
    const params = { startDate, endDate };
    dispatch(fetchOverviewMetrics(params));
    dispatch(fetchPaymentMethods(params));
    dispatch(fetchPeakHours(params));
    dispatch(fetchTopItems(params));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleApplyFilters = () => {
    loadReports();
  };

  const handleExportCSV = () => {
    dispatch(exportCSV({ startDate, endDate }));
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

        {/* Date Range Picker */}
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApplyFilters}
          onExport={handleExportCSV}
        />

        {/* Overview Cards */}
        {overview && <OverviewCards metrics={overview} />}

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
