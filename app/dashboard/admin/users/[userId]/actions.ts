"use server";

import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateApiKeyRpm(keyId: string, rpm: number) {
  const user = await getSessionUser();
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  if (typeof rpm !== 'number' || rpm < 0) {
    throw new Error('Invalid RPM value');
  }

  const updatedKey = await prisma.apiKey.update({
    where: { id: keyId },
    data: { rpm }
  });

  revalidatePath('/dashboard/admin/users/[userId]', 'page');
  return { success: true };
}
