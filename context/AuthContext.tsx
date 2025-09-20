/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth as fbAuth, googleProvider, isFirebaseReady } from "../lib/firebase";
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from "firebase/auth";
import authApi from "../services/api/auth";
import type { UserProfile } from "../types/auth.type";
import { showToast } from "../hooks/useShowToast";

type AuthContextType = {
    user: UserProfile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    loginWithGoogle: () => Promise<void>;
    signupWithEmail: (email: string, password: string, confirm: string) => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    resendEmailVerification: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    checkEmailVerification: () => Promise<boolean>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getLocaleFromPath(pathname: string): string {
    const seg = pathname.split("/").filter(Boolean);
    return seg[0] || "en";
}

function buildLocaleUrl(locale: string, path: string): string {
    const clean = path.startsWith("/") ? path : `/${path}`;
    return `/${locale}${clean}`;
}

function saveTokens(access_token: string, refresh_token: string, expires_in: number) {
    if (typeof window === "undefined") return;
    const token_expires_at = Date.now() + expires_in * 1000;
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("token_expires_at", String(token_expires_at));
    authApi.setToken(access_token);
}

function clearTokens() {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
    authApi.clearToken();
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const refreshTimerRef = useRef<number | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = !!user;

    const redirectHome = useCallback(() => {
        const locale = getLocaleFromPath(pathname || "/en");
        router.push(buildLocaleUrl(locale, "/"));
    }, [pathname, router]);

    const redirectAuth = useCallback(() => {
        const locale = getLocaleFromPath(pathname || "/en");
        router.push(buildLocaleUrl(locale, "/auth?toast=require_login"));
    }, [pathname, router]);

    const scheduleTokenRefresh = useCallback((expiresAtMs: number) => {
        if (typeof window === 'undefined') return;
        if (!expiresAtMs || Number.isNaN(expiresAtMs)) return;
        if (refreshTimerRef.current) {
            window.clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
        const now = Date.now();
        const skewMs = 60_000; // refresh 60s before expiry
        const delay = Math.max(expiresAtMs - now - skewMs, 5_000);
        const id = window.setTimeout(async () => {
            try {
                const refresh_token = window.localStorage.getItem('refresh_token');
                if (!refresh_token) throw new Error('NO_REFRESH_TOKEN');
                const resp = await authApi.refreshToken({ refresh_token });
                if (!resp.success || !resp.data) throw new Error('REFRESH_FAILED');
                const { access_token, refresh_token: new_refresh, expires_in } = resp.data;
                const newExpiresAt = Date.now() + expires_in * 1000;
                window.localStorage.setItem('access_token', access_token);
                window.localStorage.setItem('refresh_token', new_refresh || refresh_token);
                window.localStorage.setItem('token_expires_at', String(newExpiresAt));
                authApi.setToken(access_token);
                // Schedule next
                scheduleTokenRefresh(newExpiresAt);
            } catch {
                // On failure, logout and redirect to auth
                clearTokens();
                setUser(null);
                redirectAuth();
            }
        }, delay);
        refreshTimerRef.current = id as unknown as number;
    }, [redirectAuth]);

    const exchangeAndLoadProfile = useCallback(async (idToken: string) => {
        const resp = await authApi.firebaseLogin({ id_token: idToken });
        if (!resp?.success || !resp.data) throw new Error(resp?.message || "Đăng nhập thất bại");
        const { token, user: profile } = resp.data;
        saveTokens(token.access_token, token.refresh_token, token.expires_in);
        // schedule proactive refresh
        try {
            const expiresAt = Date.now() + token.expires_in * 1000;
            scheduleTokenRefresh(expiresAt);
        } catch { }
        // Optional: call getMe for fresh profile (even though resp.data.user exists)
        try {
            const me = await authApi.getMe();
            if (me.success && me.data) {
                setUser(me.data);
            } else {
                setUser(profile);
            }
        } catch {
            setUser(profile);
        }
    }, [scheduleTokenRefresh]);

    const loginWithGoogle = useCallback(async () => {
        if (!isFirebaseReady() || !fbAuth || !googleProvider) {
            showToast('error', "Không thể khởi tạo Firebase trên trình duyệt.");
            return;
        }
        setIsLoading(true);
        try {
            const cred = await signInWithPopup(fbAuth, googleProvider);
            const idToken = await cred.user.getIdToken();
            await exchangeAndLoadProfile(idToken); // Google exchange ngay
            showToast('success', "Đăng nhập Google thành công.");
            redirectHome();
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [exchangeAndLoadProfile, redirectHome]);

    const signupWithEmail = useCallback(async (email: string, password: string, confirm: string) => {
        if (!isFirebaseReady() || !fbAuth) {
            showToast('error', "Không thể khởi tạo Firebase trên trình duyệt.");
            return;
        }
        if (password !== confirm) {
            showToast('error', "Mật khẩu xác nhận không khớp.");
            return;
        }
        setIsLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(fbAuth, email, password);
            await sendEmailVerification(cred.user);
            showToast('success', "Đăng ký thành công. Vui lòng kiểm tra email để xác minh trước khi đăng nhập.");
            // Không exchange. Người dùng sẽ chuyển sang đăng nhập sau khi xác minh.
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [scheduleTokenRefresh]);

    const loginWithEmail = useCallback(async (email: string, password: string) => {
        if (!isFirebaseReady() || !fbAuth) {
            showToast('error', "Không thể khởi tạo Firebase trên trình duyệt.");
            return;
        }
        setIsLoading(true);
        try {
            const cred = await signInWithEmailAndPassword(fbAuth, email, password);
            if (!cred.user.emailVerified) {
                showToast('error', "Vui lòng xác minh email trước khi đăng nhập.");
                return;
            }
            const idToken = await cred.user.getIdToken(/* forceRefresh */ true);
            await exchangeAndLoadProfile(idToken);
            showToast('success', "Đăng nhập thành công.");
            redirectHome();
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
        } finally {
            setIsLoading(false);
        }
    }, [exchangeAndLoadProfile, redirectHome]);

    const resendEmailVerification = useCallback(async () => {
        if (!isFirebaseReady() || !fbAuth?.currentUser) {
            showToast('error', "Không tìm thấy người dùng hiện tại để gửi xác minh email.");
            return;
        }
        try {
            await sendEmailVerification(fbAuth.currentUser);
            showToast('success', "Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.");
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
        }
    }, []);

    const sendPasswordReset = useCallback(async (email: string) => {
        if (!isFirebaseReady() || !fbAuth) {
            showToast('error', "Không thể khởi tạo Firebase trên trình duyệt.");
            return;
        }
        try {
            await sendPasswordResetEmail(fbAuth, email);
            showToast('success', "Đã gửi email đặt lại mật khẩu.");
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
        }
    }, []);

    const checkEmailVerification = useCallback(async (): Promise<boolean> => {
        if (!isFirebaseReady() || !fbAuth?.currentUser) return false;
        try {
            await fbAuth.currentUser.reload();
            const verified = !!fbAuth.currentUser.emailVerified;
            if (verified) showToast('success', "Email đã được xác minh, bạn có thể đăng nhập");
            return verified;
        } catch (err: any) {
            showToast('error', mapAuthErrorToMessage(err));
            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            clearTokens();
            setUser(null);
        } finally {
            if (typeof window !== 'undefined' && refreshTimerRef.current) {
                window.clearTimeout(refreshTimerRef.current);
                refreshTimerRef.current = null;
            }
            redirectAuth();
        }
    }, [redirectAuth]);

    // Initialize from existing token on mount
    useEffect(() => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("access_token");
        if (token) {
            authApi.setToken(token);
            // Try fetch profile
            authApi
                .getMe()
                .then((resp) => {
                    if (resp.success && resp.data) setUser(resp.data);
                })
                .catch(() => {
                    // ignore; interceptor may handle
                });
            // schedule refresh if we have an expires_at
            try {
                const expiresAtStr = window.localStorage.getItem('token_expires_at');
                const expiresAt = expiresAtStr ? Number(expiresAtStr) : NaN;
                if (!Number.isNaN(expiresAt)) scheduleTokenRefresh(expiresAt);
            } catch { }
        }
    }, []);

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            isLoading,
            isAuthenticated,
            loginWithGoogle,
            signupWithEmail,
            loginWithEmail,
            resendEmailVerification,
            sendPasswordReset,
            checkEmailVerification,
            logout,
        }),
        [user, isLoading, isAuthenticated, loginWithGoogle, signupWithEmail, loginWithEmail, resendEmailVerification, sendPasswordReset, checkEmailVerification, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

function mapAuthErrorToMessage(error: any): string {
    const code = error?.code || error?.message || "unknown";
    const map: Record<string, string> = {
        "auth/invalid-email": "Email không hợp lệ.",
        "auth/user-disabled": "Tài khoản đã bị vô hiệu hoá.",
        "auth/user-not-found": "Không tìm thấy người dùng.",
        "auth/wrong-password": "Mật khẩu không đúng.",
        "auth/email-already-in-use": "Email đã được sử dụng.",
        "auth/weak-password": "Mật khẩu yếu.",
        "auth/popup-closed-by-user": "Cửa sổ đăng nhập đã bị đóng.",
    };
    // Fallback concise VN message
    return map[code] || "Đã xảy ra lỗi. Vui lòng thử lại.";
}

export default AuthContext;

