import * as admin from 'firebase-admin'

let adminDbInstance: admin.firestore.Firestore | null = null

function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim()

  // Strip a single pair of wrapping quotes if present.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1)
  }

  // Support env values copied with escaped newlines.
  key = key.replace(/\\n/g, '\n')

  return key
}

function resolvePrivateKey(): string {
  const base64Key = process.env.FIREBASE_PRIVATE_KEY_BASE64
  if (base64Key && base64Key.trim()) {
    return Buffer.from(base64Key.trim(), 'base64').toString('utf8').trim()
  }

  if (!process.env.FIREBASE_PRIVATE_KEY) {
    throw new Error('FIREBASE_PRIVATE_KEY is not set')
  }

  return normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY)
}

function initializeAdmin() {
  if (adminDbInstance) return
  
  // Check if required env vars are set
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('Firebase admin credentials not configured. Order persistence will not work.')
    return
  }

  if (!admin.apps.length) {
    const privateKey = resolvePrivateKey()

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID,
    })
  }

  adminDbInstance = admin.firestore()
}

export function getAdminDb() {
  initializeAdmin()
  if (!adminDbInstance) {
    throw new Error('Firebase admin not initialized. Check your environment variables.')
  }
  return adminDbInstance
}

export const adminDb = new Proxy(
  {},
  {
    get: (target, prop) => {
      initializeAdmin()
      if (!adminDbInstance) {
        throw new Error('Firebase admin not initialized')
      }
      return (adminDbInstance as any)[prop]
    },
  }
) as admin.firestore.Firestore
