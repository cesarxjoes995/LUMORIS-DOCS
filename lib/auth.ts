import { auth } from '@/auth';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export async function getSessionUser() {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    return user;
  } catch (error) {
    console.error("Error retrieving session user:", error);
    return null;
  }
}

// We can remove setSession and logout, because NextAuth provides signIn and signOut
// However, to prevent breaking changes if these were imported elsewhere, we can stub them or export the NextAuth functions.
import { signOut as nextAuthSignOut } from '@/auth';
export async function logout() {
  return nextAuthSignOut();
}
