import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Đảm bảo bro đã có file .env.local với RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

// Email nhận feedback
const TO_EMAIL = process.env.FEEDBACK_EMAIL || 'kurothecoder@gmail.com'; // <<< THAY BẰNG EMAIL CỦA BRO

export async function POST(req: NextRequest) {
    try {
        const { name, type, rating, message } = await req.json();

        // Validation cơ bản
        if (!name || !type || rating === undefined || !message) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const subject = `[${type === 'suggestion' ? 'Góp ý' : 'Báo lỗi'} - ${rating} Sao] - Feedback từ Grammatica`;

        // Định dạng email HTML đẹp mắt
        const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #10B981;">New Feedback from Grammatica!</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Rating:</strong> ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <h3 style="color: #333;">Message:</h3>
        <p style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
          ${message}
        </p>
      </div>
    `;

        const { data, error } = await resend.emails.send({
            from: 'Grammatica Feedback <onboarding@resend.dev>',
            to: [TO_EMAIL],
            subject: subject,
            html: htmlBody,
        });

        if (error) {
            console.error("Resend API Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: 'Feedback sent successfully!', data });

    } catch (error) {
        console.error("API Route Error:", error);
        return NextResponse.json({ error: 'Something went wrong on the server' }, { status: 500 });
    }
}