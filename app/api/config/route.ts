import { NextResponse } from 'next/server';

export async function GET() {
    const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

    return NextResponse.json({ api_url });
}

