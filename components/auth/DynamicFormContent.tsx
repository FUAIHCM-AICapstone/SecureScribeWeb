"use client";
import { useAuth } from "@/context/AuthContext";
import { Button, Divider, makeStyles } from "@fluentui/react-components";
import { useTranslations } from "next-intl";
import * as React from "react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import LoginViaEmailForm from "./LoginViaEmailForm";
import SignUpViaEmail from "./SignUpViaEmail";

type Mode = "login" | "signup" | "forgot";

// Divider docs: https://react.fluentui.dev/?path=/docs/components-divider--docs
const useStyles = makeStyles({
    container: { display: "flex", flexDirection: "column", gap: "16px" },
    divider: { marginBlock: "16px" },
    google: { width: "100%" },
});

const GoogleIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 48 48"
        aria-hidden
    >
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.602 32.912 29.184 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.875 6.053 29.7 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.483 16.041 18.879 12 24 12c3.059 0 5.842 1.151 7.961 3.039l5.657-5.657C34.875 6.053 29.7 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.114 0 9.728-1.958 13.243-5.154l-6.104-4.966C29.094 35.292 26.671 36 24 36c-5.164 0-9.57-3.07-11.292-7.435l-6.54 5.04C9.49 39.556 16.23 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.307 3.071-3.63 5.565-6.36 7.118.005-.003 12.056 8.756 12.056 8.756C42.307 40.889 44 35.724 44 30c0-1.341-.138-2.651-.389-3.917z" />
    </svg>
);

const DynamicFormContent: React.FC = () => {
    const [mode, setMode] = React.useState<Mode>("login");
    const { loginWithGoogle, isLoading } = useAuth();
    const t = useTranslations('auth');
    const styles = useStyles();

    return (
        <div className={styles.container}>
            {mode === "login" && <LoginViaEmailForm onSwitchMode={(m) => setMode(m)} />}
            {mode === "signup" && <SignUpViaEmail onSwitchMode={() => setMode("login")} />}
            {mode === "forgot" && <ForgotPasswordForm onSwitchMode={(m) => setMode(m)} />}

            {/* Visual separation between email forms and social sign-in */}
            <Divider className={styles.divider}>{t('or')}</Divider>

            <Button
                appearance="secondary"
                size="large"
                className={styles.google}
                icon={<GoogleIcon />}
                disabled={isLoading}
                onClick={() => loginWithGoogle()}
            >
                {t('google_button')}
            </Button>
        </div>
    );
};

export default DynamicFormContent;

