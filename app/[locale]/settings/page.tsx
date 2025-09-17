import { getTranslations } from 'next-intl/server';

export default async function SettingsPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('settings')}</h1>
        </div>
    );
}


