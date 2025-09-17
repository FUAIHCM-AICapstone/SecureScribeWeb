import { getTranslations } from 'next-intl/server';

export default async function IntegrationsPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('integrations')}</h1>
        </div>
    );
}


