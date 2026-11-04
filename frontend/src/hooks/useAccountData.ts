import { useContext } from 'react'
import { AccountDataContext } from '@/context/account-data-context'

export function useAccountData() {
  const ctx = useContext(AccountDataContext)
  if (!ctx) {
    throw new Error('useAccountData debe usarse dentro de <AccountDataProvider>')
  }
  return ctx
}
