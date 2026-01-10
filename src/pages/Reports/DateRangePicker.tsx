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
    <>
      <TextField
        label="Data Inicial"
        type="date"
        value={startDate}
        onChange={(e) => onStartDateChange(e.target.value)}
        size="small"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        className="animate-fade-right duration-fast"
      />

      <TextField
        label="Data Final"
        type="date"
        value={endDate}
        onChange={(e) => onEndDateChange(e.target.value)}
        size="small"
        fullWidth
        slotProps={{ inputLabel: { shrink: true } }}
        className="animate-fade-right duration-normal"
      />

      {/* Apply Button */}
      <Button
        onClick={onApply}
        variant="contained"
        size="small"
        fullWidth
        className="animate-fade-left duration-light-slow"
      >
        Aplicar
      </Button>

      {/* Export CSV Button */}
      <Button
        onClick={onExport}
        variant="contained"
        color="success"
        size="small"
        startIcon={<DownloadIcon />}
        fullWidth
        className="animate-fade-left duration-slow"
      >
        Exportar CSV
      </Button>
    </>
  );
};

export default DateRangePicker;
