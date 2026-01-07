import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createClient } from '../../store/slices/clientSlice';
import { Button, IconButton, TextField, MenuItem } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm = ({ onClose, onSuccess }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [segment, setSegment] = useState<'delivery' | 'clothing'>('delivery');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Button click → dispatch Redux action
    await dispatch(createClient({
      name,
      segment,
      whatsappNumber,
      configuration: {}
    }));

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl p-4 sm:p-6 w-full max-w-md animate-zoom-in duration-fast">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 animate-fade-right duration-very-fast">Novo Cliente</h2>
          <IconButton onClick={onClose} size="small" className="animate-fade-left duration-very-fast">
            <CloseIcon />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <TextField
            label="Nome do Negócio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            placeholder="Ex: Pizzaria do João"
            className="animate-fade-up duration-fast"
            size="small"
          />

          <TextField
            label="Segmento"
            value={segment}
            onChange={(e) => setSegment(e.target.value as 'delivery' | 'clothing')}
            required
            fullWidth
            select
            className="animate-fade-up duration-normal"
            size="small"
          >
            <MenuItem value="delivery">Delivery</MenuItem>
            <MenuItem value="clothing">Vestuário</MenuItem>
          </TextField>

          <TextField
            label="Número WhatsApp"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            required
            fullWidth
            placeholder="+5511999999999"
            helperText="Formato: +55 + DDD + Número (sem espaços)"
            className="animate-fade-up duration-light-slow"
            size="small"
          />

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outlined"
              fullWidth
              className="animate-fade-right duration-normal"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="animate-fade-left duration-normal"
            >
              Criar Cliente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
