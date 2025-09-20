import * as React from "react";

// Server Component layout wrapper for the auth route
export default function AuthRouteLayout({ children }: { children: React.ReactNode }) {
    return <div className="overflow-hidden">{children}</div>;
}

