import { Routes, Route } from 'react-router-dom'
import InvitePage from './components/InvitePage.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<InvitePage />} />
      <Route path="/invite/:id" element={<InvitePage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}
