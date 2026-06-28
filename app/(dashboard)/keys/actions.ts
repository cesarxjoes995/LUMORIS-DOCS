"use server";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/auth';

export async function createKey(formData: FormData) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  if (user.role !== 'ADMIN') throw new Error("Only admins can create API keys.");

  const name = formData.get('name') as string || 'New API Key';

  const rawKey = `sk-live-lumoris-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  await prisma.apiKey.create({
    data: {
      key: rawKey,
      name,
      userId: user.id,
    }
  });

  revalidatePath('/keys');
}

export async function revokeKey(id: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("Unauthorized");
  // Ensure the user actually owns this key or is an admin
  const key = await prisma.apiKey.findUnique({ where: { id } });
  if (key && (key.userId === user.id || user.role === 'ADMIN')) {
    await prisma.apiKey.delete({ where: { id } });
    revalidatePath('/keys');
  }
}
