// lib/email-service.ts

import nodemailer from 'nodemailer';

// Lấy thông tin cấu hình từ file .env.local
const user = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;
const from = process.env.EMAIL_FROM;

// Kiểm tra cấu hình
if (!user || !pass || !from) {
    throw new Error('Vui lòng cấu hình EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, và EMAIL_FROM trong file .env.local');
}

// Tạo "transporter" - đối tượng chịu trách nhiệm gửi mail qua SMTP của Gmail
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Sử dụng SSL
    auth: {
        user: user,
        pass: pass, // Mật khẩu ứng dụng
    },
});

// Định nghĩa kiểu dữ liệu cho các tham số
interface EmailParams {
    to: string;
    subject: string;
    html: string;
}

// Hàm chính để gửi email
export async function sendEmail({ to, subject, html }: EmailParams) {
    try {
        console.log(`[Email Service - GMAIL] Đang gửi email tới: ${to}`);
        await transporter.sendMail({
            from: from,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`[Email Service - GMAIL] Gửi email thành công!`);
    } catch (error) {
        console.error('[Email Service - GMAIL] Lỗi khi gửi email:', error);
        throw new Error('Không thể gửi email qua Gmail.');
    }
}