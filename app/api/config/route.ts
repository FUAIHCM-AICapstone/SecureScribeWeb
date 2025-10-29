import { NextResponse } from 'next/server';

export async function GET() {
    const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;
    const brand_name = process.env.NEXT_PUBLIC_BRAND_NAME || 'SecureScribe';
    const brand_logo = process.env.NEXT_PUBLIC_BRAND_LOGO || '/images/logos/logo.png';

    return NextResponse.json({ 
        api_url, 
        brand_name, 
        brand_logo 
    });
}

