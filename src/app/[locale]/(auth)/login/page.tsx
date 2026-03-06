import {LoginForm} from "@/components/features/auth/LoginForm";
import {Button} from "@/components/ui/button"
import {useTranslations} from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth');

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="max-w-[560px] w-full">
        <div className="pb-[35px]">
          <h1 className="text-center text-[34px]">{t('welcome_back')}</h1>
          <p className="text-center">{t('glad_to_see_you')}</p>
        </div>
        <div className="pb-[10px]">
          <LoginForm></LoginForm>
        </div>
        <div className="w-full flex justify-center">
          <Button variant="ghost" className="py-[16px] bg-transparent w-[280px] rounded-[999px] border-0">{t('forget_password')}</Button>
        </div>
      </div>
    </main>
  )
}
