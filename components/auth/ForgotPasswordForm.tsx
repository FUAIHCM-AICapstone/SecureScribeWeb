"use client";
import { useAuth } from "@/context/AuthContext";
import {
    Button,
    Field,
    Input,
    Spinner,
    Text,
    makeStyles,
    tokens
} from "@fluentui/react-components";
import { ArrowRightRegular, MailRegular } from "@/lib/icons";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";

type ForgotValues = { email: string };

const useStyles = makeStyles({
    header: {
        textAlign: "center",
        marginBottom: tokens.spacingVerticalXL,
        paddingTop: tokens.spacingVerticalL,
    },
    title: {
        fontSize: tokens.fontSizeHero800,
        fontWeight: tokens.fontWeightBold,
        color: tokens.colorNeutralForeground1,
        marginBottom: tokens.spacingVerticalS,
        display: "block",
        textAlign: "center",
        lineHeight: tokens.lineHeightHero800,
    },
    subtitle: {
        fontSize: tokens.fontSizeBase300,
        color: tokens.colorNeutralForeground2,
        display: "block",
        textAlign: "center",
        lineHeight: tokens.lineHeightBase300,
        maxWidth: "280px",
        margin: "0 auto",
    },
    description: {
        fontSize: tokens.fontSizeBase200,
        color: tokens.colorNeutralForeground3,
        textAlign: "center",
        marginBottom: tokens.spacingVerticalM,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
    },
    field: {
        width: "100%",
    },
    input: {
        width: "100%",
    },
    primaryButton: {
        width: "100%",
        marginTop: tokens.spacingVerticalS,
        marginBottom: tokens.spacingVerticalM,
    },
    secondaryActions: {
        display: "flex",
        justifyContent: "center",
        gap: tokens.spacingHorizontalM,
        marginTop: tokens.spacingVerticalS,
    },
    secondaryButton: {
        fontSize: tokens.fontSizeBase200,
        padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
        minWidth: "auto",
        ":hover": {
            backgroundColor: tokens.colorNeutralBackground1Hover,
        },
    },
});

const ForgotPasswordForm: React.FC<{ onSwitchMode?: (mode: "login" | "signup") => void }> = ({ onSwitchMode }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotValues>({
        defaultValues: { email: "" }
    });
    const { sendPasswordReset, isLoading } = useAuth();
    const t = useTranslations('auth');
    const styles = useStyles();

    const onSubmit = async (values: ForgotValues) => {
        await sendPasswordReset(values.email);
    };

    return (
        <div>
            <div className={styles.header}>
                <Text className={styles.title}>{t('forgot_title')}</Text>
                <Text className={styles.subtitle}>
                    {t('forgot_subtitle', { defaultValue: 'Reset your password securely' })}
                </Text>
            </div>

            <Text className={styles.description}>{t('forgot_description')}</Text>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <Field
                    className={styles.field}
                    label={t('email_label')}
                    validationMessage={errors.email?.message}
                    validationState={errors.email ? "error" : "none"}
                    required
                >
                    <Input
                        className={styles.input}
                        type="email"
                        placeholder={t('email_placeholder')}
                        contentBefore={<MailRegular />}
                        {...register("email", {
                            required: t('email_required', { defaultValue: 'Email is required' }),
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t('email_invalid', { defaultValue: 'Invalid email address' })
                            }
                        })}
                    />
                </Field>

                <Button
                    className={styles.primaryButton}
                    appearance="primary"
                    type="submit"
                    disabled={isLoading}
                    icon={isLoading ? undefined : <ArrowRightRegular />}
                    size="large"
                >
                    {isLoading ? <Spinner size="small" /> : t('send_reset_button')}
                </Button>

                <div className={styles.secondaryActions}>
                    <Button
                        className={styles.secondaryButton}
                        appearance="transparent"
                        type="button"
                        onClick={() => onSwitchMode?.("login")}
                    >
                        {t('to_login')}
                    </Button>
                    <Button
                        className={styles.secondaryButton}
                        appearance="transparent"
                        type="button"
                        onClick={() => onSwitchMode?.("signup")}
                    >
                        {t('to_signup')}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;

