import { Route, Routes } from 'react-router-dom'
import GuestRoute from '@/components/GuestRoute'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import AppLayout from '@/layouts/AppLayout'
import Assistant from '@/pages/Assistant'
import Forecast from '@/pages/Forecast'
import Home from '@/pages/Home'
import Learn from '@/pages/Learn'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Register from '@/pages/Register'
import Transactions from '@/pages/Transactions'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="movimientos" element={<Transactions />} />
            <Route path="pronostico" element={<Forecast />} />
            <Route path="asistente" element={<Assistant />} />
            <Route path="aprende" element={<Learn />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
