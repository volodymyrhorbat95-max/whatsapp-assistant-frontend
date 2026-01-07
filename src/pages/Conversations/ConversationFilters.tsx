import { Button, TextField, MenuItem } from '@mui/material';

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
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <TextField
          label="Data Inicial"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Data Final"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Status"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          size="small"
          fullWidth
          select
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
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="true">Sim</MenuItem>
          <MenuItem value="false">Não</MenuItem>
        </TextField>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onApply}
          variant="contained"
          size="small"
        >
          Aplicar Filtros
        </Button>
        <Button
          onClick={onClear}
          variant="outlined"
          size="small"
        >
          Limpar
        </Button>
      </div>
    </div>
  );
};

export default ConversationFilters;
