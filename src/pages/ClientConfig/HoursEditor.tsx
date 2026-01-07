// Hours Editor - Edit operating hours for each day of the week

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { updateClient } from '../../store/slices/clientSlice';
import { Client, OperatingHours } from '../../types';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';

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
  const dispatch = useDispatch<AppDispatch>();
  const [hours, setHours] = useState<OperatingHours>(
    client.configuration.operatingHours || {}
  );
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async () => {
    const updatedConfiguration = {
      ...client.configuration,
      operatingHours: hours
    };

    await dispatch(updateClient({
      clientId: client.id,
      configuration: updatedConfiguration
    }));

    setHasChanges(false);
  };

  const updateDayHours = (day: string, field: 'open' | 'close', value: string) => {
    const newHours = { ...hours };
    if (!newHours[day]) {
      newHours[day] = { open: '', close: '' };
    }
    newHours[day][field] = value;
    setHours(newHours);
    setHasChanges(true);
  };

  const toggleDay = (day: string) => {
    const newHours = { ...hours };
    if (newHours[day]) {
      delete newHours[day];
    } else {
      newHours[day] = { open: '09:00', close: '18:00' };
    }
    setHours(newHours);
    setHasChanges(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Horário de Funcionamento
        </h2>
        {hasChanges && (
          <Button
            onClick={handleSave}
            variant="contained"
          >
            Salvar Alterações
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {DAYS_OF_WEEK.map(({ key, label }) => {
          const isEnabled = !!hours[key];
          const dayHours = hours[key];

          return (
            <div key={key} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isEnabled}
                    onChange={() => toggleDay(key)}
                  />
                }
                label={label}
                sx={{ flex: 1, minWidth: '150px' }}
              />

              {isEnabled && dayHours && (
                <div className="flex items-center gap-3">
                  <TextField
                    type="time"
                    value={dayHours.open || ''}
                    onChange={(e) => updateDayHours(key, 'open', e.target.value)}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                  <span className="text-gray-600">às</span>
                  <TextField
                    type="time"
                    value={dayHours.close || ''}
                    onChange={(e) => updateDayHours(key, 'close', e.target.value)}
                    size="small"
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </div>
              )}

              {!isEnabled && (
                <div className="text-sm text-gray-400">
                  Fechado
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Nota:</strong> O bot responderá automaticamente fora do horário de funcionamento
          informando que o estabelecimento está fechado.
        </p>
      </div>
    </div>
  );
};

export default HoursEditor;
