// File: middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Hàm này sẽ được gọi cho mỗi request khớp với matcher bên dưới
export function middleware(request: NextRequest) {
    // 1. Lấy token từ cookie (bạn có thể đổi tên 'auth-token' cho phù hợp)
    const authToken = request.cookies.get('auth-token')?.value;

    // 2. Lấy đường dẫn hiện tại
    const { pathname } = request.nextUrl;

    // 3. Các route cần đăng nhập mới được vào
    const protectedRoutes = ['/Home']; // Thêm các route khác trong (App) vào đây

    // 4. Các route công khai, ai cũng vào được
    const publicRoutes = ['/Login', '/']; // '/' là trang landing page của bạn

    // 5. Logic chuyển hướng

    // NẾU: Cố gắng truy cập vào trang cần đăng nhập MÀ không có token
    if (protectedRoutes.some(path => pathname.startsWith(path)) && !authToken) {
        // Chuyển hướng về trang login
        const url = request.nextUrl.clone();
        url.pathname = '/Login';
        return NextResponse.redirect(url);
    }

    // NẾU: Đã đăng nhập rồi (có token) MÀ lại vào trang login
    if (pathname.startsWith('/Login') && authToken) {
        // Chuyển hướng về trang Home
        const url = request.nextUrl.clone();
        url.pathname = '/Home';
        return NextResponse.redirect(url);
    }

    // Nếu không rơi vào các trường hợp trên, cho phép đi tiếp
    return NextResponse.next();
}

// Cấu hình: Chỉ áp dụng middleware cho các route được liệt kê
// Điều này giúp tối ưu, không chạy middleware cho các file tĩnh như images, css
export const config = {
    matcher: [
        /*
         * Khớp với tất cả các route, TRỪ các route sau:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}