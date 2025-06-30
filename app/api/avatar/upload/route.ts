import { put, del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { customAlphabet } from 'nanoid';

// Creates a unique, URL-friendly ID. Still a legendary move.
const nanoid = customAlphabet(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    7
);

export async function POST(request: Request): Promise<NextResponse> {
    // We're expecting three things now: the filename, the old URL, and the file itself
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');
    const oldAvatarUrl = searchParams.get('oldAvatarUrl'); // <-- THE NEW INTEL

    if (!filename) {
        return NextResponse.json(
            { error: 'No filename provided.' },
            { status: 400 }
        );
    }

    if (!request.body) {
        return NextResponse.json({ error: 'No file to upload.' }, { status: 400 });
    }

    // Same unique filename logic, keeps everything safe from collisions.
    const fileExtension = filename.split('.').pop() || 'png';
    const uniqueFilename = `avatars/${nanoid()}.${fileExtension}`;

    try {
        // Stage 1: Upload the a new file.
        const blob = await put(uniqueFilename, request.body, {
            access: 'public',
            cacheControlMaxAge: 31536000, // Cache for 1 year
        });

        // Stage 2: The cleanup crew. Delete the old avatar.
        // This is a pro-gamer "fire-and-forget" move.
        if (oldAvatarUrl && oldAvatarUrl.includes('vercel-storage.com')) {
            try {
                // We don't need to wait for this to finish to send a response.
                // Let it run in the background.
                del(oldAvatarUrl);
            } catch (deleteError) {
                // If deleting fails, it's not a critical error. The user still got their new avatar.
                // We just log it on the server and move on.
                console.error("Failed to delete old avatar, but upload was successful:", deleteError);
            }
        }

        // We send back the new blob data immediately.
        return NextResponse.json(blob);

    } catch (error) {
        console.error('Upload Error:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json(
            { error: `Failed to upload file: ${errorMessage}` },
            { status: 500 }
        );
    }
}