import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import ChatIcon from '@mui/icons-material/Chat';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    {
      path: '/clients',
      label: 'Clientes',
      icon: <BusinessIcon />
    },
    {
      path: '/conversations',
      label: 'Conversas',
      icon: <ChatIcon />
    },
    {
      path: '/reports',
      label: 'Relatórios',
      icon: <AssessmentIcon />
    }
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Assistente Virtual WhatsApp
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              variant={isActive(item.path) ? 'contained' : 'text'}
              color={isActive(item.path) ? 'primary' : 'inherit'}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
