import { useEffect, useState } from 'react';
import { loadRuntimeConfig, getApiEndpoint, getBrandConfig, RuntimeConfig } from '@/lib/utils/runtimeConfig';

export function useRuntimeConfig() {
    const [config, setConfig] = useState<RuntimeConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            const cfg = loadRuntimeConfig();
            setConfig(cfg);
            setLoading(false);
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }, []);

    return { config, loading, error };
}

export function useApiEndpoint() {
    const [endpoint, setEndpoint] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const ep = getApiEndpoint();
            setEndpoint(ep);
            setLoading(false);
        } catch (err) {
            console.error('Failed to get API endpoint:', err);
            setLoading(false);
        }
    }, []);

    return { endpoint, loading };
}

export function useBrandConfig() {
    const [brand, setBrand] = useState<{ name: string; logo: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const brandCfg = getBrandConfig();
            setBrand(brandCfg);
            setLoading(false);
        } catch (err) {
            console.error('Failed to get brand config:', err);
            setLoading(false);
        }
    }, []);

    return { brand, loading };
}