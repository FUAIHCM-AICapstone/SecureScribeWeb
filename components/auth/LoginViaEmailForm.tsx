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
import {
    ArrowRightRegular,
    DismissRegular,
    PasswordRegular,
    PersonRegular
} from "@/lib/icons";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useForm } from "react-hook-form";

type LoginFormValues = { email: string; password: string };

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
    loginButton: {
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

const LoginViaEmailForm: React.FC<{ onSwitchMode?: (mode: "signup" | "forgot") => void }> = ({ onSwitchMode }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        defaultValues: { email: "", password: "" }
    });
    const { loginWithEmail, isLoading } = useAuth();
    const t = useTranslations('auth');
    const styles = useStyles();

    const onSubmit = async (data: LoginFormValues) => {
        await loginWithEmail(data.email, data.password);
    };

    return (
        <div>
            <div className={styles.header}>
                <Text className={styles.title}>
                    {t('login_title')}
                </Text>
                <Text className={styles.subtitle}>
                    {t('login_subtitle', { defaultValue: 'Enter your credentials to access your account' })}
                </Text>
            </div>

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
                        contentBefore={<PersonRegular />}
                        autoComplete="email"
                        {...register("email", {
                            required: t('email_required', { defaultValue: 'Email is required' }),
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t('email_invalid', { defaultValue: 'Invalid email address' })
                            }
                        })}
                    />
                </Field>

                <Field
                    className={styles.field}
                    label={t('password_label')}
                    validationMessage={errors.password?.message}
                    validationState={errors.password ? "error" : "none"}
                    required
                >
                    <Input
                        className={styles.input}
                        type="password"
                        placeholder={t('password_placeholder')}
                        contentBefore={<PasswordRegular />}
                        autoComplete="current-password"
                        {...register("password", {
                            required: t('password_required', { defaultValue: 'Password is required' }),
                            minLength: {
                                value: 6,
                                message: t('password_min_length', { defaultValue: 'Password must be at least 6 characters' })
                            }
                        })}
                    />
                </Field>

                <div className={styles.secondaryActions}>
                    <Button
                        className={styles.secondaryButton}
                        appearance="transparent"
                        type="button"
                        onClick={() => onSwitchMode?.("forgot")}
                        icon={<DismissRegular />}
                    >
                        {t('to_forgot')}
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
                <Button
                    className={styles.loginButton}
                    appearance="primary"
                    type="submit"
                    disabled={isLoading}
                    icon={isLoading ? undefined : <ArrowRightRegular />}
                    size="large"
                >
                    {isLoading ? <Spinner size="small" /> : t('login_button')}
                </Button>

            </form>
        </div>
    );
};

export default LoginViaEmailForm;

