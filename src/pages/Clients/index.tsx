import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchClients } from '../../store/slices/clientSlice';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ClientsPage = () => {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.client);
  const [showForm, setShowForm] = useState(false);

  // Page load → dispatch Redux action
  useEffect(() => {
    dispatch(fetchClients());
  }, [dispatch]);

  const handleSuccess = () => {
    dispatch(fetchClients());
  };

  // useSelector reads data → UI renders
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
            <p className="text-gray-600 mt-1">
              {clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Novo Cliente
          </Button>
        </div>

        {/* Client List */}
        <ClientList clients={clients} />

        {/* Client Form Modal */}
        {showForm && (
          <ClientForm
            onClose={() => setShowForm(false)}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
