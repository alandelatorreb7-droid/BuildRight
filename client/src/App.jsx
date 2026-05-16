import { Routes, Route } from 'react-router-dom';
import QuotePage from './components/QuotePage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuotePage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/panel" element={<AdminPanel />} />
    </Routes>
  );
}
