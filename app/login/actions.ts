"use server";

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { cookies } from 'next/headers';

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    // Store email in cookie for the OTP verification page
    const cookieStore = await cookies();
    cookieStore.set('verifyEmail', email, { path: '/', maxAge: 60 * 15 }); // 15 mins

    // This will redirect to the verification page if successful
    await signIn('resend', { email, redirectTo: '/' });
  } catch (error: any) {
    if (error instanceof AuthError) {
      console.error("Sign in error:", error);
      return { error: 'Something went wrong with authentication.' };
    }
    
    // Rethrow all other errors (including Next.js redirects)
    throw error;
  }
}
