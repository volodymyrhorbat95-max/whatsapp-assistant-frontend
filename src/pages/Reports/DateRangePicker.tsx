import { Button, TextField } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface Props {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
  onExport: () => void;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onExport
}: Props) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-end gap-3 sm:gap-4">
        <TextField
          label="Data Inicial"
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
          slotProps={{ inputLabel: { shrink: true } }}
          className="animate-fade-right duration-very-fast"
        />

        <TextField
          label="Data Final"
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          sx={{ flex: 1, minWidth: '200px' }}
          slotProps={{ inputLabel: { shrink: true } }}
          className="animate-fade-right duration-fast"
        />

        {/* Apply Button */}
        <Button
          onClick={onApply}
          variant="contained"
          className="animate-fade-left duration-normal"
        >
          Aplicar
        </Button>

        {/* Export CSV Button */}
        <Button
          onClick={onExport}
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          className="animate-fade-left duration-light-slow"
        >
          Exportar CSV
        </Button>
      </div>
    </div>
  );
};

export default DateRangePicker;
