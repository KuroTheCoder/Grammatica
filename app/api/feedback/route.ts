// app/api/feedback/route.ts (Đã sửa đổi)

import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service'; // <<< IMPORT HÀM CHUNG

// IMPORTANT: Email này giờ sẽ được lấy từ .env.local
const TO_EMAIL = 'kurothecoder@gmail.com';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, type, rating, message } = body;

        if (!name || !type || !rating || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Gọi hàm sendEmail đã được chuẩn hóa
        await sendEmail({
            to: TO_EMAIL,
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

        return NextResponse.json({ message: 'Feedback sent successfully!' });

    } catch (e) {
        const error = e as Error;
        console.error("Lỗi khi xử lý feedback:", error.message);
        return NextResponse.json({ error: 'Failed to send feedback.' }, { status: 500 });
    }
}