import { Button, TextField, MenuItem } from '@mui/material';
import { useAppSelector } from '../../store/hooks';

interface Props {
  startDate: string;
  endDate: string;
  status: string;
  converted: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onConvertedChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

const ConversationFilters = ({
  startDate,
  endDate,
  status,
  converted,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onConvertedChange,
  onApply,
  onClear
}: Props) => {
  const { isLoading } = useAppSelector((state) => state.loading);

  return (
    <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
      <div className="grid gap-3 sm:gap-4 @[480px]:grid-cols-2">
        <TextField
          label="Data Inicial"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          className="animate-fade-right duration-very-fast"
        />

        <TextField
          label="Data Final"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
          className="animate-fade-right duration-fast"
        />

        <TextField
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          size="small"
          fullWidth
          select
          className="animate-fade-right duration-normal"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ongoing">Em andamento</MenuItem>
          <MenuItem value="completed">Concluída</MenuItem>
          <MenuItem value="abandoned">Abandonada</MenuItem>
          <MenuItem value="transferred">Transferida</MenuItem>
        </TextField>

        <TextField
          label="Convertida"
          value={converted}
          onChange={(e) => onConvertedChange(e.target.value)}
          size="small"
          fullWidth
          select
          className="animate-fade-right duration-light-slow"
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Sim</MenuItem>
          <MenuItem value="false">Não</MenuItem>
        </TextField>

        <Button
          onClick={onApply}
          variant="contained"
          size="small"
          className="animate-fade-up duration-normal"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
        </Button>
        <Button
          onClick={onClear}
          variant="outlined"
          size="small"
          className="animate-fade-up duration-light-slow"
          fullWidth
          disabled={isLoading}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default ConversationFilters;
