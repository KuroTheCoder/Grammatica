// file: app/api/auth/send-login-notification/route.tsx (REDESIGNED)

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    const { userId, email } = await request.json();

    if (!userId || !email) {
        return NextResponse.json({ error: 'Missing user information' }, { status: 400 });
    }

    try {
        // --- Core Logic: Create security token ---
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
        const secureLink = `${domain}/api/auth/secure-account?token=${token}`;

        await adminDb.collection('security_tokens').add({
            userId, token, expiresAt, used: false, createdAt: new Date(),
        });

        // --- Email Sending Logic ---
        try {
            const emailSubject = `[Grammatica] New Sign-In to Your Account`;
            const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .header { background-color: #040D0A; padding: 24px; text-align: center; }
        .header img { max-width: 160px; }
        .content { padding: 32px; color: #212529; }
        .content h1 { font-size: 28px; font-weight: 700; margin: 0 0 16px; color: #000000; }
        .content p { font-size: 16px; line-height: 1.6; margin: 0 0 16px; color: #495057; }
        .info-box { background-color: #f1f3f5; border-radius: 6px; padding: 16px; margin: 24px 0; font-size: 14px; }
        .info-box strong { color: #000000; }
        .cta-button { display: inline-block; background-color: #dc3545; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; text-align: center; margin: 16px 0; }
        .footer { background-color: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <!-- BRO, REPLACE THIS WITH YOUR HOSTED LOGO URL -->
            <img src="https://i.ibb.co/b3xLp0N/grammatica-logo-white.png" alt="Grammatica Logo">
        </div>
        <div class="content">
            <h1>New sign-in detected</h1>
            <p>We noticed a new sign-in to your Grammatica account. If this was you, you can safely ignore this email.</p>
            
            <div class="info-box">
                <strong>Time:</strong> ${new Date().toLocaleString('en-US', {timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'long', timeStyle: 'short'})}
            </div>
            
            <p>If you don't recognize this activity, we recommend securing your account immediately. Clicking the button below will sign you out of all other devices.</p>
            
            <div style="text-align: center;">
                <a href="${secureLink}" class="cta-button">Secure My Account & Sign Out</a>
            </div>
            
            <p style="font-size: 14px; color: #6c757d;">This security link is valid for 24 hours.</p>
        </div>
        <div class="footer">
            © ${new Date().getFullYear()} Grammatica. All rights reserved.
        </div>
    </div>
</body>
</html>`;

            await sendEmail({
                to: email,
                subject: emailSubject,
                html: emailHtml,
            });
        } catch (emailError) {
            console.error("ERROR SENDING LOGIN NOTIFICATION EMAIL:", emailError);
            // We don't return an error to the client, as the login itself was successful.
        }

    } catch (dbError) {
        console.error("ERROR CREATING SECURITY TOKEN:", dbError);
        // This is a server-side issue, but we still don't want to block the user's login.
    }

    // Always return success to the front-end to ensure a smooth login flow.
    return NextResponse.json({ success: true });
}