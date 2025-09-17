import { getTranslations } from 'next-intl/server';

export default async function HelpPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('help')}</h1>
        </div>
    );
}


