import { useNavigate } from 'react-router-dom';
import { Client } from '../../types';
import { Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import { useTheme } from '@mui/material/styles';

interface Props {
  clients: Client[];
}

const ClientList = ({ clients }: Props) => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Button click → navigate using useNavigate (no Link/a tags per rule.txt)
  const handleConfigClick = (clientId: number) => {
    navigate(`/clients/${clientId}/config`);
  };

  // Get segment label in PT-BR
  const getSegmentLabel = (segment: string) => {
    return segment === 'delivery' ? 'Delivery' : 'Vestuário';
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  // Get status label in PT-BR
  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo';
  };

  if (clients.length === 0) {
    return (
      <div className="bg-white rounded-sm shadow p-8 text-center animate-zoom-in duration-slow">
        <div className="text-gray-500">
          <BusinessIcon
            className="mx-auto mb-4 animate-fade-down duration-fast"
            sx={{ fontSize: 48, color: 'rgba(156, 163, 175, 1)' }}
          />
          <p className="text-lg animate-fade-up duration-normal">Nenhum cliente cadastrado</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-sm shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead style={{ backgroundColor: theme.palette.primary.light }} className="animate-fade-down duration-normal">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider animate-fade-right duration-very-fast" style={{ color: '#ffffff' }}>
                Nome do Negócio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider animate-fade-right duration-fast" style={{ color: '#ffffff' }}>
                Segmento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider animate-fade-right duration-normal" style={{ color: '#ffffff' }}>
                WhatsApp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider animate-fade-right duration-light-slow" style={{ color: '#ffffff' }}>
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider animate-fade-left duration-slow" style={{ color: '#ffffff' }}>
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client, index) => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors animate-fade-up" style={{ animationDuration: `${400 + (index % 3) * 200}ms` }}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{getSegmentLabel(client.segment)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{client.whatsappNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                      client.status
                    )}`}
                  >
                    {getStatusLabel(client.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    onClick={() => handleConfigClick(client.id)}
                    variant="text"
                    startIcon={<SettingsIcon />}
                  >
                    Editar Configurações
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {clients.map((client, index) => (
          <div
            key={client.id}
            className="bg-white rounded-sm shadow p-4 animate-fade-up"
            style={{ animationDuration: `${400 + (index % 3) * 200}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{getSegmentLabel(client.segment)}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                  client.status
                )}`}
              >
                {getStatusLabel(client.status)}
              </span>
            </div>
            <div className="text-sm text-gray-600 mb-3">
              <span className="font-medium">WhatsApp:</span> {client.whatsappNumber}
            </div>
            <Button
              onClick={() => handleConfigClick(client.id)}
              variant="outlined"
              startIcon={<SettingsIcon />}
              fullWidth
              size="small"
            >
              Editar Configurações
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ClientList;
