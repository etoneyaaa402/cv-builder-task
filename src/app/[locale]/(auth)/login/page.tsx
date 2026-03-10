import { LoginForm } from "@/components/features/auth/LoginForm";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Header } from "@/components/features/auth/Header";
import Link from 'next/link'

export default function LoginPage() {
  const t = useTranslations("Auth");

  return (
    <div className="h-screen overflow-hidden">
      <Header mode="login" />
      <main className="flex justify-center items-center h-full">
        <div className="max-w-140 w-full p-5">
          <div className="pb-8.75">
            <h1 className="text-[34px] text-basic-text text-center pb-6.5">{t("welcome_back")}</h1>
            <p className="text-center text-basic-text">{t("glad_to_see_you")}</p>
          </div>
          <div className="pb-2">
            <LoginForm />
          </div>
          <div className="w-full flex justify-center">
            <Button
              asChild
              variant="transparent"
              size="redButton"
            >
              <Link className="text-light-gray" href="/forgot-password">{t("forgot_password")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
