import { Routes, Route, Navigate } from 'react-router-dom';
import ConversationsPage from './pages/Conversations';
import ClientsPage from './pages/Clients';
import ClientConfig from './pages/ClientConfig';
import ReportsPage from './pages/Reports';
import GlobalSpinner from './components/GlobalSpinner';
import Navigation from './components/Navigation';

function App() {
  return (
    <>
      <GlobalSpinner />
      <Navigation />
      <Routes>
        {/* Clients list page */}
        <Route path="/clients" element={<ClientsPage />} />

        {/* Main conversations page */}
        <Route path="/conversations" element={<ConversationsPage />} />

        {/* Reports page */}
        <Route path="/reports" element={<ReportsPage />} />

        {/* Client configuration page */}
        <Route path="/clients/:id/config" element={<ClientConfig />} />

        {/* Redirect root to clients */}
        <Route path="/" element={<Navigate to="/clients" replace />} />

        {/* 404 - redirect to clients */}
        <Route path="*" element={<Navigate to="/clients" replace />} />
      </Routes>
    </>
  );
}

export default App;
