import { Outlet, Route, Routes } from 'react-router-dom'
import AdminRoute from '@/components/AdminRoute'
import GuestRoute from '@/components/GuestRoute'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AccountDataProvider } from '@/context/AccountDataContext'
import { AuthProvider } from '@/context/AuthContext'
import AppLayout from '@/layouts/AppLayout'
import PublicLayout from '@/layouts/PublicLayout'
import Admin from '@/pages/Admin'
import Assistant from '@/pages/Assistant'
import Forecast from '@/pages/Forecast'
import Home from '@/pages/Home'
import Learn from '@/pages/Learn'
import LinkAccount from '@/pages/LinkAccount'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Aplicacion from '@/pages/public/Aplicacion'
import Giro from '@/pages/public/Giro'
import Landing from '@/pages/public/Landing'
import Nosotros from '@/pages/public/Nosotros'
import Planes from '@/pages/public/Planes'
import Register from '@/pages/Register'
import Transactions from '@/pages/Transactions'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="giro" element={<Giro />} />
          <Route path="planes" element={<Planes />} />
          <Route path="aplicacion" element={<Aplicacion />} />
        </Route>

        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Register />} />
        </Route>

        <Route path="app" element={<ProtectedRoute />}>
          <Route element={<AccountDataLayout />}>
            <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="movimientos" element={<Transactions />} />
              <Route path="cuentas" element={<LinkAccount />} />
              <Route path="pronostico" element={<Forecast />} />
              <Route path="asistente" element={<Assistant />} />
              <Route path="aprende" element={<Learn />} />
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<Admin />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

/** Datos de cuenta (movimientos, metas, retos) solo existen dentro de la app autenticada. */
function AccountDataLayout() {
  return (
    <AccountDataProvider>
      <Outlet />
    </AccountDataProvider>
  )
}
