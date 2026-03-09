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
        <div className="max-w-[560px] w-full p-[20px]">
          <div className="pb-[35px]">
            <h1 className="text-center text-[34px]">{t("welcome_back")}</h1>
            <p className="text-center">{t("glad_to_see_you")}</p>
          </div>
          <div className="pb-[10px]">
            <LoginForm />
          </div>
          <div className="w-full flex justify-center">
            <Button
              asChild
              variant="transparent"
              size="redButton"
            >
              <Link href="/forgot-password">{t("forgot_password")}</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
