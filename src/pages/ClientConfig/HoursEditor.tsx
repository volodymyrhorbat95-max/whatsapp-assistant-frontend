// Hours Editor - Edit operating hours for each day of the week

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, OperatingHours } from '../../types';
import { Button, Checkbox, FormControlLabel, TextField, Alert } from '@mui/material';

interface Props {
  client: Client;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' }
];

const HoursEditor = ({ client }: Props) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.loading);

  // Sanitize operating hours data - remove any invalid entries
  const sanitizeHours = (rawHours: OperatingHours | undefined): OperatingHours => {
    if (!rawHours) return {};

    const cleaned: OperatingHours = {};
    Object.keys(rawHours).forEach((day) => {
      const dayHours = rawHours[day];
      // Only include if both open and close are valid time strings (HH:MM format)
      if (dayHours && dayHours.open && dayHours.close &&
          /^\d{2}:\d{2}$/.test(dayHours.open) && /^\d{2}:\d{2}$/.test(dayHours.close)) {
        cleaned[day] = dayHours;
      }
    });
    return cleaned;
  };

  const [hours, setHours] = useState<OperatingHours>(
    sanitizeHours(client.configuration.operatingHours)
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sync local state when client prop updates (after save)
  useEffect(() => {
    setHours(sanitizeHours(client.configuration.operatingHours));
  }, [client.configuration.operatingHours]);

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    const updatedConfiguration = {
      ...client.configuration,
      operatingHours: hours
    };

    const result = await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    // ✅ Check if action succeeded
    if (updateClient.fulfilled.match(result)) {
      setSuccess('Horários salvos com sucesso!');
      setHasChanges(false);
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error?.message || 'Falha ao salvar horários');
    }
  };

  const updateDayHours = (day: string, field: 'open' | 'close', value: string) => {
    setHours(prevHours => {
      const existingDay = prevHours[day] || { open: '', close: '' };
      return {
        ...prevHours,
        [day]: {
          ...existingDay,
          [field]: value
        }
      };
    });
    setHasChanges(true);
  };

  const toggleDay = (day: string) => {
    setHours(prevHours => {
      if (prevHours[day]) {
        const { [day]: _, ...rest } = prevHours;
        return rest;
      } else {
        return {
          ...prevHours,
          [day]: { open: '09:00', close: '18:00' }
        };
      }
    });
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-sm shadow p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 animate-fade-down duration-very-fast">
          Horário de Funcionamento
        </h2>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
            className="animate-fade-left duration-fast"
            fullWidth
            disabled={isLoading}
            sx={{ maxWidth: { sm: '200px' } }}
          >
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        )}
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} className="mb-4 animate-fade-down duration-fast">
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} className="mb-4 animate-fade-down duration-fast">
          {success}
        </Alert>
      )}

      <div className="space-y-3 sm:space-y-4">
        {DAYS_OF_WEEK.map(({ key, label }, index) => {
          const isEnabled = !!hours[key];
          const dayHours = hours[key];

          return (
            <div key={key} className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-sm animate-fade-right duration-${index % 2 === 0 ? 'normal' : 'light-slow'}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEnabled}
                    onChange={() => toggleDay(key)}
                  />
                }
                label={label}
                sx={{ flex: 1, minWidth: '150px', margin: 0 }}
              />

              {isEnabled && dayHours && (
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
                  <TextField
                    type="time"
                    value={dayHours.open || ''}
                    onChange={(e) => updateDayHours(key, 'open', e.target.value)}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ minWidth: '120px' }}
                  />
                  <span className="text-sm sm:text-base text-gray-600">às</span>
                  <TextField
                    type="time"
                    value={dayHours.close || ''}
                    onChange={(e) => updateDayHours(key, 'close', e.target.value)}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ minWidth: '120px' }}
                  />
                </div>
              )}

              {!isEnabled && (
                <div className="text-xs sm:text-sm text-gray-400">
                  Fechado
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-sm animate-fade-up duration-slow">
        <p className="text-xs sm:text-sm text-blue-800">
          <strong>Nota:</strong> O bot responderá automaticamente fora do horário de funcionamento
          informando que o estabelecimento está fechado.
        </p>
      </div>
    </div>
  );
};

export default HoursEditor;
