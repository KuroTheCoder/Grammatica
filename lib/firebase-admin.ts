// lib/firebase-admin.ts

// Import thư viện Firebase Admin
import * as admin from 'firebase-admin';

// Xử lý chuỗi private key từ file .env.local.
// File .env không thể chứa ký tự xuống dòng, nên ta phải thay thế '\n' bằng '\n'.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

// Kiểm tra xem đã có instance nào của Firebase Admin được khởi tạo chưa.
// Giống như file client, điều này để tránh khởi tạo lại nhiều lần và gây lỗi.
if (!admin.apps.length) {
    try {
        // Khởi tạo app với thông tin chứng thực từ service account.
        // Các biến môi trường này phải được giữ bí mật tuyệt đối.
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
                clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
                privateKey, // privateKey đã được xử lý ở trên
            }),
        });
    } catch (error) {
        console.error('Lỗi khởi tạo Firebase Admin SDK:', error);
    }
}

// Export ra các dịch vụ của Admin SDK để các API Route có thể sử dụng.
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();