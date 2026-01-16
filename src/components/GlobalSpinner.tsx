import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { useAppSelector } from '../store/hooks';

const GlobalSpinner = () => {
  const isLoading = useAppSelector((state) => state.loading.isLoading);

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
      open={isLoading}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          borderRadius: '2px',
          p: 3
        }}
      >
        <CircularProgress size={48} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Carregando...
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default GlobalSpinner;
