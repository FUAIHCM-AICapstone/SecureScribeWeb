import { getTranslations } from 'next-intl/server';

export default async function ReportsPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('reports')}</h1>
        </div>
    );
}


