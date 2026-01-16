import {
    Dialog,
    DialogSurface,
    DialogBody,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
} from '@/lib/components';
import { useTranslations } from 'next-intl';

interface AuthOverlayProps {
    locale: string;
    shouldShow: boolean;
}

export function AuthOverlay({ locale, shouldShow }: AuthOverlayProps) {
    const t = useTranslations('AuthOverlay');

    if (!shouldShow) {
        return null;
    }

    return (
        <>
            <style>{`
                /* Override Fluent UI Dialog backdrop with blur effect */
                .fui-DialogSurface__backdrop {
                    backdrop-filter: blur(40px) !important;
                }
                
                /* Fallback for native dialog backdrop */
                dialog::backdrop {
                    backdrop-filter: blur(40px) !important;
                }
            `}</style>

            <Dialog open={shouldShow} modalType="alert">
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>{t('title')}</DialogTitle>
                        <DialogContent>
                            <p style={{ margin: '16px 0', fontSize: '14px' }}>
                                {t('description')}
                            </p>
                        </DialogContent>
                        <DialogActions>
                            <DialogContent>
                                <Button
                                    appearance="primary"
                                    onClick={() => {
                                        window.location.href = `/${locale}/auth`;
                                    }}
                                    style={{ minWidth: '120px' }}
                                >
                                    {t('signIn')}
                                </Button>
                            </DialogContent>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
}
