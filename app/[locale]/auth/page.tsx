import * as React from "react";
import AuthLayout from "../../../components/auth/AuthLayout";
import DynamicFormContent from "../../../components/auth/DynamicFormContent";
import AuthRedirectIfAuthenticated from "../../../components/auth/AuthRedirectIfAuthenticated";

// Server Component page: client auth/redirect handling occurs inside client components
export default function AuthPage() {
    return (
        <AuthLayout>
            <AuthRedirectIfAuthenticated />
            <DynamicFormContent />
        </AuthLayout>
    );
}

