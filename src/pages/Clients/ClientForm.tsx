import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createClient } from '../../store/slices/clientSlice';
import { Button, IconButton, TextField, MenuItem, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const ClientForm = ({ onClose, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.loading);
  const [name, setName] = useState('');
  const [segment, setSegment] = useState<'delivery' | 'clothing'>('delivery');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  // Validate business name
  const validateName = (value: string): boolean => {
    setNameError(null);

    const trimmed = value.trim();
    if (trimmed.length === 0) {
      setNameError('Nome do negócio é obrigatório');
      return false;
    }

    if (trimmed.length < 2) {
      setNameError('Nome deve ter pelo menos 2 caracteres');
      return false;
    }

    return true;
  };

  // Validate WhatsApp number format
  const validateWhatsAppNumber = (number: string): boolean => {
    setWhatsappError(null);

    // Must start with +
    if (!number.startsWith('+')) {
      setWhatsappError('Número deve começar com +');
      return false;
    }

    // Must be between 10-15 digits (including country code)
    const digitsOnly = number.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setWhatsappError('Número inválido (mínimo 10 dígitos, máximo 15)');
      return false;
    }

    // Brazilian format: +55 (2 digits) + DDD (2 digits) + Number (8-9 digits)
    // Example: +5511999999999
    const brazilianPattern = /^\+55\d{10,11}$/;
    if (!brazilianPattern.test(number)) {
      setWhatsappError('Formato brasileiro esperado: +55 + DDD + Número');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate name before submitting
    if (!validateName(name)) {
      return;
    }

    // Validate WhatsApp number before submitting
    if (!validateWhatsAppNumber(whatsappNumber)) {
      return;
    }

    // Button click → dispatch Redux action
    const result = await dispatch(createClient({
      name,
      segment,
      whatsappNumber,
      configuration: {}
    }));

    // ✅ Check if action succeeded
    if (createClient.fulfilled.match(result)) {
      setSuccess('Cliente criado com sucesso!');
      onSuccess();
      // Close after showing success message briefly
      setTimeout(() => onClose(), 1500);
    } else {
      // ✅ Show error to user
      setError(result.error?.message || 'Falha ao criar cliente');
      // ✅ Form stays open for correction
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          className: 'animate-zoom-in duration-fast',
          sx: { borderRadius: '2px' }
        }
      }}
    >
      <DialogTitle className="flex justify-between items-center">
        <span className="text-lg sm:text-xl font-bold text-gray-900">Novo Cliente</span>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 pt-2">
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          )}

          <TextField
            label="Nome do Negócio"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            placeholder="Ex: Pizzaria do João"
            size="small"
            disabled={isLoading}
            error={!!nameError}
            slotProps={{
              htmlInput: { maxLength: 255 }
            }}
            helperText={nameError || `${name.length}/255 caracteres`}
          />

          <TextField
            label="Segmento"
            value={segment}
            onChange={(e) => setSegment(e.target.value as 'delivery' | 'clothing')}
            required
            fullWidth
            select
            size="small"
            disabled={isLoading}
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
            helperText={whatsappError || "Formato: +55 + DDD + Número (sem espaços)"}
            error={!!whatsappError}
            size="small"
            disabled={isLoading}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Cliente'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientForm;
