import NotFound from 'components/layout/NotFound';
import '@/styles/globals.css';
import { Metadata } from 'next';

// Get branding configuration from environment variables
function getBrandConfig() {
  const brandName = process.env.BRAND_NAME || 'SecureScribe';
  const brandLogo = process.env.BRAND_LOGO || '/images/logos/logo.png';
  return { brandName, brandLogo };
}

const { brandName, brandLogo } = getBrandConfig();

export const metadata: Metadata = {
  title: `404 - ${brandName}`,
  description:
    `Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển. Quay lại trang chủ ${brandName} để tiếp tục sử dụng các tính năng ghi chú, transcript, quản lý task và lịch sử cuộc họp tự động.`,
  robots: 'noindex, nofollow',
  openGraph: {
    title: `404 - ${brandName}`,
    description: 'Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.',
    url: 'https://SecureScribe/404',
    type: 'website',
    siteName: brandName,
    images: [
      {
        url: 'https://SecureScribe/images/background-features.jpg',
        width: 1200,
        height: 630,
        alt: `${brandName} - AI Note Taker`,
      },
    ],
    locale: 'vi_VN',
  },
  icons: {
    icon: brandLogo,
  },
};

export default function NotFoundPage() {
  return <NotFound />;
}
