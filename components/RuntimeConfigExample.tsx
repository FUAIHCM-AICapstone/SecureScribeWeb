'use client';

import Image from 'next/image';
import { useRuntimeConfig, useApiEndpoint, useBrandConfig } from '@/hooks/useRuntimeConfig';

export default function RuntimeConfigExample() {
    const { config, loading: configLoading, error } = useRuntimeConfig();
    const { endpoint, loading: endpointLoading } = useApiEndpoint();
    const { brand, loading: brandLoading } = useBrandConfig();

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-red-800 font-semibold">Lỗi tải cấu hình</h3>
                <p className="text-red-600">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Cấu hình Runtime</h2>

            {/* Full config */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Cấu hình đầy đủ:</h3>
                {configLoading ? (
                    <p>Đang tải...</p>
                ) : (
                    <pre className="text-sm bg-white p-2 rounded border overflow-x-auto">
                        {JSON.stringify(config, null, 2)}
                    </pre>
                )}
            </div>

            {/* API Endpoint */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">API Endpoint:</h3>
                {endpointLoading ? (
                    <p>Đang tải...</p>
                ) : (
                    <p className="text-blue-800 font-mono">{endpoint}</p>
                )}
            </div>

            {/* Brand Config */}
            <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Thông tin thương hiệu:</h3>
                {brandLoading ? (
                    <p>Đang tải...</p>
                ) : brand ? (
                    <div className="flex items-center space-x-4">
                        <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <span className="text-green-800 font-semibold">{brand.name}</span>
                    </div>
                ) : null}
            </div>
        </div>
    );
}