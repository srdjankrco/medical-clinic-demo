import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import PatientRegister from './pages/PatientRegister'
import PatientList from './pages/PatientList'
import PatientProfile from './pages/PatientProfile'
import AppointmentCalendar from './pages/AppointmentCalendar'
import ClinicalDocumentation from './pages/ClinicalDocumentation'
import PatientPortal from './pages/PatientPortal'
import Reports from './pages/Reports'
import IndiaCompliance from './pages/IndiaCompliance'
import QatarCompliance from './pages/QatarCompliance'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients/register" element={<PatientRegister />} />
          <Route path="patients/list" element={<PatientList />} />
          <Route path="patients/search" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="appointments/calendar" element={<AppointmentCalendar />} />
          <Route path="appointments/new" element={<AppointmentCalendar />} />
          <Route path="clinical/documentation" element={<ClinicalDocumentation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="compliance/india" element={<IndiaCompliance />} />
          <Route path="compliance/qatar" element={<QatarCompliance />} />
          <Route path="portal" element={<PatientPortal />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
