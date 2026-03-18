import * as admin from 'firebase-admin'

let adminDbInstance: admin.firestore.Firestore | null = null

function initializeAdmin() {
  if (adminDbInstance) return
  
  // Check if required env vars are set
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn('Firebase admin credentials not configured. Order persistence will not work.')
    return
  }

  if (!admin.apps.length) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
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
