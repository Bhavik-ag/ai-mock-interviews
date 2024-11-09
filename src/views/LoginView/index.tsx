import AuthLayout from "@/components/ui/auth-layout";
import LoginForm from "./components/LoginForm";

const LoginView = async () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginView;
