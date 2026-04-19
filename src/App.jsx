import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext.jsx';
import PublicDashboard from './pages/PublicDashboard.jsx';
import WorkerDashboard from './pages/WorkerDashboard.jsx';
import WorkerOrgInfo from './pages/WorkerOrgInfo.jsx';
import WorkerPending from './pages/WorkerPending.jsx';
import WorkerSignIn from './pages/WorkerSignIn.jsx';
import WorkerSignUp from './pages/WorkerSignUp.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AppDataProvider>
        <Routes>
          <Route path="/" element={<PublicDashboard />} />
          <Route path="/worker/sign-in" element={<WorkerSignIn />} />
          <Route path="/worker/sign-up" element={<WorkerSignUp />} />
          <Route path="/worker/org-info" element={<WorkerOrgInfo />} />
          <Route path="/worker/pending" element={<WorkerPending />} />
          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppDataProvider>
    </BrowserRouter>
  );
}
