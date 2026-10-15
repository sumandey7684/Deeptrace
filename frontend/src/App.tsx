import { AnimatePresence } from 'framer-motion';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { SectionPage } from './pages/SectionPage';

function RouteScene() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/blocking-rules" element={<SectionPage title="Blocking Rules" />} />
          <Route path="/performance" element={<SectionPage title="Engine Performance" />} />
          <Route path="/pcap-files" element={<SectionPage title="PCAP Files" />} />
          <Route path="/recent-packets" element={<SectionPage title="Recent Packets" />} />
          <Route path="/domains" element={<SectionPage title="Detected Domains" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return <RouteScene />;
}
