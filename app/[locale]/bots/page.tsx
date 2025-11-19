import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import { getMeetings } from '@/services/api/meeting';
import { BotsPageClient } from './components/BotsPageClient';

export default async function BotsPage() {
    const queryClient = new QueryClient();

    // Prefetch meetings data for the bots page
    await queryClient.prefetchQuery({
        queryKey: [...queryKeys.meetings, {}, { page: 1, limit: 20 }],
        queryFn: () => getMeetings({}, { page: 1, limit: 20 }),
        staleTime: 5 * 60 * 1000,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BotsPageClient />
        </HydrationBoundary>
    );
}


