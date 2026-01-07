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

  const animationClasses = [
    'animate-fade-down duration-fast',
    'animate-fade-down duration-normal',
    'animate-fade-down duration-light-slow'
  ];

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(66, 153, 225, 0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <Toolbar sx={{ maxWidth: '1280px', width: '100%', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 } }}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            color: 'white'
          }}
          className="animate-fade-right duration-fast"
        >
          <span className="hidden sm:inline">Assistente Virtual WhatsApp</span>
          <span className="sm:hidden">WhatsApp Bot</span>
        </Typography>

        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1 } }}>
          {navItems.map((item, index) => (
            <Button
              key={item.path}
              onClick={() => navigate(item.path)}
              startIcon={item.icon}
              variant={isActive(item.path) ? 'contained' : 'text'}
              color={isActive(item.path) ? 'primary' : 'inherit'}
              className={animationClasses[index]}
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '4px 8px', sm: '6px 16px' },
                minWidth: { xs: 'auto', sm: '64px' },
                color: isActive(item.path) ? undefined : 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden sr-only">{item.label}</span>
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
