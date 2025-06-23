import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Make sure the variable name here matches your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

// IMPORTANT: Replace with your verified domain email and the destination email
const FROM_EMAIL = 'onboarding@resend.dev'; // Use a verified Resend domain email
const TO_EMAIL = 'kurothecoder@gmail.com';   // The email where you want to receive feedback

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, type, rating, message } = body;

        // --- Server-side validation ---
        if (!name || !type || !rating || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is not set in environment variables.");
            return NextResponse.json({ error: 'Server configuration error: Missing API Key' }, { status: 500 });
        }

        // --- Sending the email ---
        const { data, error } = await resend.emails.send({
            from: `Grammatica Feedback <${FROM_EMAIL}>`, // Sender display name and email
            to: [TO_EMAIL],
            subject: `New Feedback from ${name}: ${type}`,
            html: `
        <div>
          <h2>New Grammatica Feedback</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Rating:</strong> ${rating} / 5</p>
          <hr />
          <h3>Message:</h3>
          <p>${message}</p>
        </div>
      `,
        });

        // If Resend itself returns an error
        if (error) {
            console.error("Resend API Error:", error);
            return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Feedback sent successfully!', data });

    } catch (e) {
        // Catch any other unexpected errors (e.g., JSON parsing failed)
        const error = e as Error;
        console.error("Internal Server Error:", error.message);
        return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
    }
}