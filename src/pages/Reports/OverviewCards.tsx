import { OverviewMetrics } from '../../store/slices/reportsSlice';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface Props {
  metrics: OverviewMetrics;
}

const OverviewCards = ({ metrics }: Props) => {
  const conversionRate = metrics.conversationsStarted > 0
    ? ((metrics.conversions / metrics.conversationsStarted) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
      {/* Conversations Started */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-up duration-very-fast">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Conversas Iniciadas</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {metrics.conversationsStarted}
            </p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <ChatBubbleOutlineIcon sx={{ fontSize: 24, color: '#2563eb' }} />
          </div>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white rounded-lg shadow p-6 animate-zoom-in duration-fast">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {conversionRate}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {metrics.conversions} conversões
            </p>
          </div>
          <div className="bg-green-100 rounded-full p-3">
            <CheckCircleOutlineIcon sx={{ fontSize: 24, color: '#16a34a' }} />
          </div>
        </div>
      </div>

      {/* Abandonments */}
      <div className="bg-white rounded-lg shadow p-6 animate-fade-up duration-normal">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Abandonos</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {metrics.abandonments}
            </p>
          </div>
          <div className="bg-red-100 rounded-full p-3">
            <CloseIcon sx={{ fontSize: 24, color: '#dc2626' }} />
          </div>
        </div>
      </div>

      {/* Average Ticket */}
      <div className="bg-white rounded-lg shadow p-6 animate-flip-up duration-light-slow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              R$ {metrics.averageTicket.toFixed(2)}
            </p>
          </div>
          <div className="bg-yellow-100 rounded-full p-3">
            <AttachMoneyIcon sx={{ fontSize: 24, color: '#ca8a04' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
