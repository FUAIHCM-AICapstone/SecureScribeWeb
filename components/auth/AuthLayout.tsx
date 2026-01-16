"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { Card, CardHeader, Title3, Title2, Body1, makeStyles, shorthands, Avatar, tokens } from "@fluentui/react-components";
import { Shield20Filled, Flash20Filled, PeopleTeam20Filled, DataBarVertical20Filled } from "@/lib/icons";
import { useTranslations } from "next-intl";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { getBrandConfig } from "@/lib/utils/runtimeConfig";

const useStyles = makeStyles({
    root: {
        display: "grid",
        minHeight: "100vh",
        gridTemplateColumns: "1fr",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: tokens.colorNeutralBackground1,
        // Desktop: two-pane layout with exact 50/50 split
        "@media (min-width: 1024px)": {
            gridTemplateColumns: "1fr 1fr",
        },
    },
    brandPanel: {
        display: "none",
        "@media (min-width: 1024px)": {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: "48px",
            position: "relative",
            overflow: "hidden",
            backgroundColor: tokens.colorNeutralBackground2,
        },
    },
    brandLogo: {
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        backgroundColor: tokens.colorNeutralBackground1,
        border: `4px solid ${tokens.colorNeutralStroke1}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 20px 40px rgba(0,0,0,0.15)`,
        position: "relative",
        zIndex: 2,
    },
    brandText: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "24px",
        maxWidth: "520px",
        textAlign: "center",
        position: "relative",
        zIndex: 2,
    },
    featuresList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "40px",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        zIndex: 2,
    },
    featureItem: {
        display: "flex",
        alignItems: "center",
        gap: "20px",
        fontSize: "16px",
        color: tokens.colorNeutralForeground1,
        padding: "20px 24px",
        borderRadius: "16px",
        backgroundColor: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.08)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-100%",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255,255,255,0.2)",
        },
    },
    featureIcon: {
        width: "28px",
        height: "28px",
        color: tokens.colorBrandForeground1,
        flexShrink: 0,
    },
    themeToggle: {
        position: "absolute",
        bottom: "32px",
        right: "32px",
        zIndex: 1000,
    },
    cardWrap: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
    },
    card: {
        width: "100%",
        maxWidth: "560px",
        ...shorthands.padding("32px"),
        borderRadius: "20px",
        boxShadow: `0 25px 60px rgba(0,0,0,0.15)`,
        backgroundColor: tokens.colorNeutralBackground1,
        border: `1px solid ${tokens.colorNeutralStroke2}`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: tokens.colorBrandBackground,
        },
    },
});

type AuthLayoutProps = {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children }) => {
    const styles = useStyles();
    const t = useTranslations("auth");

    // Brand configuration state with defaults
    const [brandName, setBrandName] = useState('SecureScribe');
    const [brandLogo, setBrandLogo] = useState('/images/logos/logo2.png');

    // Load brand configuration from runtime config
    useEffect(() => {
        try {
            const brandCfg = getBrandConfig();
            setBrandName(brandCfg.name);
            setBrandLogo(brandCfg.logo);
        } catch (error) {
            console.warn('Failed to load brand config, using defaults:', error);
            // Keep default values on error
        }
    }, []);

    return (
        <div className={styles.root}>
            {/* Brand / Hero panel (visible on desktop) */}
            <section className={styles.brandPanel} aria-label="Brand intro">
                <Avatar
                    className={styles.brandLogo}
                    image={{
                        src: brandLogo,
                        alt: `${brandName} logo`
                    }}
                    initials="SS"
                />
                <div className={styles.brandText}>
                    <Title2>{t("hero_title", { brand: brandName })}</Title2>
                    <Body1 style={{ fontSize: "20px", lineHeight: "1.6", fontWeight: 500 }}>
                        {t("hero_subtitle")}
                    </Body1>
                    <Body1 style={{ fontSize: "17px", fontWeight: 400 }}>
                        {t("hero_description")}
                    </Body1>
                </div>

                {/* Features list */}
                <div className={styles.featuresList}>
                    <div className={styles.featureItem}>
                        <Shield20Filled className={styles.featureIcon} />
                        <span>{t("feature_security")}</span>
                    </div>
                    <div className={styles.featureItem}>
                        <Flash20Filled className={styles.featureIcon} />
                        <span>{t("feature_speed")}</span>
                    </div>
                    <div className={styles.featureItem}>
                        <PeopleTeam20Filled className={styles.featureIcon} />
                        <span>{t("feature_collaboration")}</span>
                    </div>
                    <div className={styles.featureItem}>
                        <DataBarVertical20Filled className={styles.featureIcon} />
                        <span>{t("feature_analytics")}</span>
                    </div>
                </div>
            </section>

            {/* Theme Toggle - Bottom Right Corner */}
            <div className={styles.themeToggle}>
                <ThemeToggle />
            </div>

            {/* Auth card */}
            <div className={styles.cardWrap}>
                <Card className={styles.card}>
                    {(title || subtitle) && (
                        <CardHeader
                            header={<Title3>{title}</Title3>}
                            description={<Body1>{subtitle}</Body1>}
                        />
                    )}
                    {children}
                </Card>
            </div>
        </div>
    );
};

export default AuthLayout;

