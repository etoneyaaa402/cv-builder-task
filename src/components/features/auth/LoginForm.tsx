"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useTranslations} from "next-intl";

export function LoginForm() {
  const t = useTranslations('Auth');

  const formSchema = z.object({
    email: z.string().email({
      message: t('wrong_email'),
    }),
    password: z.string().min(6, {
      message: t('wrong_password'),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Data:", values)
  }

  return (
    <div>
      <Form {...form}>
        <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[20px] pb-[60px]">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel hidden>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      className="text-[16px] p-[12px] rounded-none"
                      type="email"
                      placeholder={t('email')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>)}
            />

            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel hidden>{t('password')}</FormLabel>
                  <FormControl>
                    <Input
                      className="text-[16px] p-[12px] rounded-none"
                      type="password"
                      placeholder={t('password')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>)}
            />
          </div>

          <div className="w-full flex justify-center">
            <Button
              type="submit"
              variant="destructive"
              className="text-[#ffffff] py-[16px] w-[280px] uppercase border-0 text-[14px] rounded-[999px]"
            >
              {t('log_in')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
