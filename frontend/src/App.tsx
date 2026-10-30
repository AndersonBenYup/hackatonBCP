import { Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import Home from '@/pages/Home'
import Transactions from '@/pages/Transactions'
import Forecast from '@/pages/Forecast'
import Assistant from '@/pages/Assistant'
import Learn from '@/pages/Learn'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="movimientos" element={<Transactions />} />
        <Route path="pronostico" element={<Forecast />} />
        <Route path="asistente" element={<Assistant />} />
        <Route path="aprende" element={<Learn />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
