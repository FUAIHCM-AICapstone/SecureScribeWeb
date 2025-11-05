"use client";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

function getLocaleFromPath(pathname: string): string {
    const seg = pathname.split("/").filter(Boolean);
    return seg[0] || "en";
}

export default function AuthRedirectIfAuthenticated() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        if (isAuthenticated) {
            const locale = getLocaleFromPath(pathname || "/en");
            router.replace(`/${locale}/`);
        }
    }, [isAuthenticated, pathname, router]);

    return null;
}
