import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"
import fs from "fs"
import path from "path"

import { Resend as ResendClient } from 'resend';

const resendClient = new ResendClient(process.env.AUTH_RESEND_KEY);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: "Lumoris Labs <no-reply@info.lumorislabs.online>",
      maxAge: 5 * 60, // 5 minutes
      generateVerificationToken() {
        // Generate a random 6-digit OTP
        return Math.floor(100000 + Math.random() * 900000).toString();
      },
      async sendVerificationRequest({ identifier: email, url, token, provider }) {
        try {
          await resendClient.emails.send({
            from: provider.from as string,
            to: email,
            subject: `Your Lumoris Labs Verification Code: ${token}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify your identity</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f5; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        
                        <!-- Header -->
                        <tr>
                          <td style="background-color: #000000; padding: 32px 40px; text-align: center;">
                            <img src="https://pub-3e9c281d3be8430f96a4ddca55730640.r2.dev/logo-email.png" alt="Lumoris Labs Logo" width="48" height="48" style="display: block; margin: 0 auto 16px auto; border-radius: 8px;" />
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0; letter-spacing: -0.5px;">Lumoris Labs</h1>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding: 48px 40px;">
                            <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
                              Hello,
                            </p>
                            <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 24px; color: #3f3f46;">
                              We received a request to sign in to your Lumoris Labs account. Enter the following verification code to complete the process:
                            </p>
                            
                            <!-- OTP Box -->
                            <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 32px;">
                              <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 40px; font-weight: 700; letter-spacing: 8px; color: #000000;">
                                ${token}
                              </div>
                            </div>

                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 20px; color: #71717a;">
                              <strong>Note:</strong> This code is highly secure and will expire in exactly 5 minutes.
                            </p>
                            <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a;">
                              If you did not request this email, please ignore it or contact our security team if you have concerns.
                            </p>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #fafafa; border-top: 1px solid #f4f4f5; padding: 32px 40px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; line-height: 16px; color: #a1a1aa;">
                              &copy; ${new Date().getFullYear()} Lumoris Labs Inc. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; line-height: 16px; color: #a1a1aa;">
                              Secure API Gateway &bull; Ultra-low Latency Infrastructure
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `
          });
        } catch (error) {
          console.error("Failed to send verification email:", error);
          throw new Error("Failed to send verification email");
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
    verifyRequest: '/login/verify', // A page to tell the user to check their email
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    }
  }
})
