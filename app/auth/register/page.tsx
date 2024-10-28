// app/register/page.tsx
import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create an account"
      subtitle="Get started with your free account"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
