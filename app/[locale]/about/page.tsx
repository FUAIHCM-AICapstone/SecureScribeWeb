import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('about')}</h1>
        </div>
    );
}


