// file: app/api/feedback/route.tsx (Bản vá lỗi cuối cùng, thật đấy!)

import {NextResponse} from 'next/server';
import {sendEmail} from '@/lib/email-service';
import {render} from '@react-email/render'; // <<<< Thư viện này giờ trả về Promise
import {FeedbackEmail} from '@/emails/FeedbackEmail';
import React from 'react';

const TO_EMAIL = 'kurothecoder@gmail.com';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {name, type, rating, message} = body;

        if (!name || !type || !rating || !message) {
            return NextResponse.json({error: 'Missing required fields'}, {status: 400});
        }

        const validatedType = (type === 'suggestion' || type === 'bug') ? type : 'suggestion';

        // <<< FIX CUỐI CÙNG LÀ ĐÂY BRO ƠI >>>
        // Thêm 'await' để đợi hàm render xử lý xong và trả về chuỗi HTML
        const emailHtml = await render(
            <FeedbackEmail
                name={name}
                type={validatedType}
                rating={Number(rating)}
                message={message}
            />
        );

        await sendEmail({
            to: TO_EMAIL,
            subject: `[Grammatica] New ${type} from ${name}`,
            html: emailHtml, // Bây giờ emailHtml đã là string, không còn là Promise
        });

        return NextResponse.json({message: 'Feedback sent successfully!'});

    } catch (e) {
        const error = e as Error;
        console.error("[FEEDBACK_API_ERROR]", error);
        return NextResponse.json({error: 'Failed to send feedback.'}, {status: 500});
    }
}