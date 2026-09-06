import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Snowflake, Loader2, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { loginSchema, type LoginValues } from '@/pages/auth/schemas/login.schema';
import { useLoginMutation } from '@/pages/auth/hooks/useLoginMutation';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'carlos@polarxpress.com', password: 'demo123' },
  });

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-md border-border/60 shadow-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Snowflake className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">Ice King</span>
        </div>
        <CardTitle className="text-2xl">{t('auth.title')}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t('auth.subtitle')}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.fields.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@business.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {t(errors.email.message as string)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.fields.password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {t(errors.password.message as string)}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {t('auth.button.signIn')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.newBusiness')}{' '}
            <button
              type="button"
              onClick={() => navigate('/auth/register')}
              className="font-medium text-primary hover:underline"
            >
              {t('auth.createAccount')}
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}