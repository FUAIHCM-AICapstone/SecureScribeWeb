import { getTranslations } from 'next-intl/server';

export default async function ChatPage() {
    const t = await getTranslations('Sidebar');
    return (
        <div>
            <h1>{t('chat')}</h1>
        </div>
    );
}


