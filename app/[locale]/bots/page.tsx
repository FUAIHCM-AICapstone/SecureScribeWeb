import { getTranslations } from 'next-intl/server';

export default async function BotsPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('bots')}</h1>
        </div>
    );
}


