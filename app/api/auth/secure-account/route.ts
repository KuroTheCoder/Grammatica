import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000';

    if (!token) {
        return NextResponse.redirect(`${domain}/login?error=invalid_link`);
    }

    try {
        // 1. Tìm token trong DB
        const query = adminDb.collection('security_tokens')
            .where('token', '==', token)
            .where('expiresAt', '>', new Date())
            .where('used', '==', false)
            .limit(1);

        const snapshot = await query.get();

        if (snapshot.empty) {
            // Token không hợp lệ, hết hạn hoặc đã được sử dụng
            return NextResponse.redirect(`${domain}/login?error=link_expired`);
        }

        const tokenDoc = snapshot.docs[0];
        const { userId } = tokenDoc.data();

        // 2. Vô hiệu hóa tất cả các phiên đăng nhập của user này
        await adminAuth.revokeRefreshTokens(userId);

        // 3. Đánh dấu token đã được sử dụng
        await tokenDoc.ref.update({ used: true });

        // 4. Chuyển hướng người dùng đến trang thông báo thành công
        return NextResponse.redirect(`${domain}/account-secured`);

    } catch (error) {
        console.error('Lỗi khi bảo vệ tài khoản:', error);
        return NextResponse.redirect(`${domain}/login?error=server_error`);
    }
}