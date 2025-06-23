// app/api/auth/send-login-notification/route.ts (Đã sửa đổi)

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service'; // <<< IMPORT HÀM CHUNG
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    const { userId, email } = await request.json();

    if (!userId || !email) {
        return NextResponse.json({ error: 'Thiếu thông tin User' }, { status: 400 });
    }

    // Luồng tạo token và lưu DB vẫn chạy trước
    try {
        const token = randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';
        const secureLink = `${domain}/api/auth/secure-account?token=${token}`;

        await adminDb.collection('security_tokens').add({
            userId, token, expiresAt, used: false, createdAt: new Date(),
        });

        // TÁCH RA: Khối try...catch riêng cho việc gửi email
        try {
            await sendEmail({
                to: email,
                subject: 'Thông báo đăng nhập mới vào tài khoản Grammatica',
                html: `<div style="background-color: #f4f4f7; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
    
    <div style="background-color: #040D0A; padding: 20px; text-align: center;">
      <!-- THAY THẾ LINK LOGO CỦA BRO VÀO ĐÂY -->
      <img src="https://link-den-logo-cua-ban.com/logo.png" alt="Grammatica Logo" style="max-width: 180px;">
    </div>
    
    <div style="padding: 30px; color: #333;">
      <h1 style="font-size: 24px; font-weight: 600; color: #111; margin-bottom: 20px;">
        Phát hiện đăng nhập mới
      </h1>
      <p style="font-size: 16px; line-height: 1.7; color: #555;">
        Xin chào, chúng tôi ghi nhận một hoạt động đăng nhập vào tài khoản Grammatica của bạn.
      </p>
      
      <div style="background: #eef7ff; border-left: 5px solid #0ea5e9; padding: 15px 20px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px;"><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})}</p>
        <!-- Có thể thêm thông tin IP và User Agent nếu bro truyền vào API -->
        <!-- <p style="margin: 5px 0 0; font-size: 14px;"><strong>Thiết bị:</strong> Chrome on Windows</p> -->
      </div>
      
      <p style="font-size: 16px; line-height: 1.7; color: #555;">
        Nếu đây không phải là bạn, hãy bảo vệ tài khoản của bạn ngay lập tức. Chúng tôi sẽ đăng xuất tất cả các phiên đăng nhập khác.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${secureLink}" target="_blank" style="background: linear-gradient(90deg, #ef4444, #dc2626); color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4);">
          Đăng xuất tất cả thiết bị
        </a>
      </div>
      
      <p style="font-size: 14px; color: #888; text-align: center;">
        Nếu bạn là người thực hiện hành động này, bạn có thể yên tâm bỏ qua email này.
      </p>
    </div>
    
    <div style="background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af;">
      © ${new Date().getFullYear()} Grammatica. Mọi quyền được bảo lưu.
    </div>
  </div>
</div>`, // Giữ nguyên nội dung html của bro
            });
        } catch (emailError) {
            // Nếu gửi email lỗi, chỉ log ra server, không báo lỗi cho client
            console.error("LỖI GỬI EMAIL THÔNG BÁO ĐĂNG NHẬP:", emailError);
        }

    } catch (dbError) {
        // Lỗi này xảy ra nếu không ghi được vào DB
        console.error("LỖI KHI TẠO TOKEN BẢO MẬT:", dbError);
    }

    // Luôn trả về success để không chặn luồng đăng nhập
    return NextResponse.json({ success: true });
}