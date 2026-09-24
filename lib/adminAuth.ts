import { auth, isAdminEmail } from '@/auth'

/**
 * Returns the admin session if the current next-auth visitor is an allowlisted
 * admin, otherwise null. Use this in API route handlers to gate admin actions.
 */
export async function requireAdminSession() {
  const session = await auth()
  if (!session?.user || !isAdminEmail(session.user.email)) {
    return null
  }
  return session
}
