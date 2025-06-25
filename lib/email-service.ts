// file: lib/email-service.ts (REDESIGNED & UPGRADED)

import nodemailer from 'nodemailer';

// --- Configuration ---
// This part is solid, no changes needed.
const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;
const from = `Grammatica <${process.env.EMAIL_FROM}>`; // Better "From" name

if (!user || !pass || !process.env.EMAIL_FROM) {
    throw new Error('Please configure EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, and EMAIL_FROM in your .env.local file');
}

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: user,
        pass: pass,
    },
});

// --- Interfaces ---

interface EmailParams {
    to: string;
    subject: string;
    html: string;
}

// Interface for our new theming helper
interface ThemedEmailParams {
    preheader: string; // Shows in email client preview text
    headerText: string;
    bodyContent: string; // Can contain simple HTML like <p> and <strong>
    button?: {
        text: string;
        url: string;
    };
}

// ============================================================================
// THEME & TEMPLATE HELPER (This is the core of the redesign)
// ============================================================================
export function createThemedEmailHtml(params: ThemedEmailParams): string {
    const { preheader, headerText, bodyContent, button } = params;
    const year = new Date().getFullYear();

    // The button HTML is generated only if a button object is provided
    const buttonHtml = button
        ? `
        <div style="text-align: center; margin: 32px 0;">
            <a href="${button.url}" target="_blank" style="display: inline-block; background-color: #10b981; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; text-align: center;">
                ${button.text}
            </a>
        </div>
        `
        : '';

    return `
<!DOCTYPE html>
<html lang="vie">
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
        .footer { background-color: #f1f3f5; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .preheader { display: none; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; }
    </style>
</head>
<body>
    <span class="preheader">${preheader}</span>
    <div class="container">
        <div class="header">
            <!-- BRO, REPLACE THIS WITH YOUR HOSTED LOGO URL -->
            <img src="https://i.ibb.co/b3xLp0N/grammatica-logo-white.png" alt="Grammatica Logo">
        </div>
        <div class="content">
            <h1>${headerText}</h1>
            ${bodyContent}
            ${buttonHtml}
        </div>
        <div class="footer">
            © ${year} Grammatica. All rights reserved.
        </div>
    </div>
</body>
</html>`;
}


// ============================================================================
// CORE SENDING FUNCTION (The engine)
// ============================================================================
export async function sendEmail({ to, subject, html }: EmailParams) {
    try {
        console.log(`[Email Service] Sending email to: ${to} with subject: "${subject}"`);
        await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`[Email Service] Email sent successfully!`);
    } catch (error) {
        console.error('[Email Service] Error sending email:', error);
        // Re-throw the error so the calling function knows something went wrong.
        throw new Error('Failed to send email.');
    }
}