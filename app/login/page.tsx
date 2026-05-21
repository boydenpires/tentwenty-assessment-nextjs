import LoginBranding from "@/app/components/LoginBranding";
import LoginForm from "@/app/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-2 bg-white md:min-h-screen">
      <main
        className="px-6 py-8 md:p-18 grid place-items-center"
        aria-label="Sign in to ticktock"
      >
        <LoginForm />
      </main>

      <LoginBranding />
    </div>
  );
}
