import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

/**
 * Credenciales: en Render se pega el JSON completo del service account en
 * FIREBASE_SERVICE_ACCOUNT (env var secreta). En local se usa
 * GOOGLE_APPLICATION_CREDENTIALS apuntando a backend/firebase.json (gitignored).
 */
if (getApps().length === 0) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) })
  } else {
    initializeApp()
  }
}

export const db = getFirestore()
