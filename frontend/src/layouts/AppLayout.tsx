import { Outlet } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'

const appName = import.meta.env.VITE_APP_NAME ?? 'Finanzas IA'

export default function AppLayout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-slate-50 shadow-xl">
      <header className="bg-brand-900 px-4 py-4 text-white">
        <h1 className="text-lg font-bold">{appName}</h1>
        <p className="text-xs text-brand-100">Aprende y decide mejor con tu dinero</p>
      </header>
      <main className="flex-1 space-y-4 p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
