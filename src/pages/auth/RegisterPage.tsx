import { Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Snowflake, Loader2, ArrowRight } from 'lucide-react';

import { registerSchema, type RegisterValues } from './schemas/register.schema.ts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useRegisterMutation } from './hooks/useRegisterMutation.ts';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { mutate: registerBusiness, isPending } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessName: '',
      ownerName: '',
      email: '',
      password: '',
      nicho: '',
      baseCurrency: 'USD',
      businessFundPercent: 60,
      personalProfitPercent: 40,
    },
  });

  const baseCurrency = watch('baseCurrency');
  const businessFundPercent = watch('businessFundPercent') ?? 60;
  const personalProfitPercent = 100 - businessFundPercent;

  const onSubmit = (data: RegisterValues) => {
    registerBusiness(data);
  };

  return (
    <Card className="w-full max-w-2xl border-border/60 shadow-xl">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Snowflake className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-2xl">{t('auth.register.title')}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('auth.register.subtitle')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="businessName">{t('auth.register.businessName')}</Label>
              <Input
                id="businessName"
                placeholder="Polar Express C.A."
                {...register('businessName')}
              />
              {errors.businessName && (
                <p className="text-xs text-destructive">
                  {errors.businessName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">{t('auth.register.ownerName')}</Label>
              <Input
                id="ownerName"
                placeholder="Carlos Rodríguez"
                {...register('ownerName')}
              />
              {errors.ownerName && (
                <p className="text-xs text-destructive">
                  {errors.ownerName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@negocio.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.register.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nicho">{t('auth.register.nicho')}</Label>
              <Input
                id="nicho"
                placeholder="Hielo, Bebidas, Refrigeración..."
                {...register('nicho')}
              />
              {errors.nicho && (
                <p className="text-xs text-destructive">
                  {errors.nicho.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t('auth.register.baseCurrency')}</Label>
              <Select
                  value={baseCurrency}
                  onValueChange={(v) => 
                    setValue('baseCurrency', v as RegisterValues['baseCurrency'], { shouldValidate: true })
                  }
                >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">$ USD (Dólar)</SelectItem>
                  <SelectItem value="BS">Bs. (Bolívares)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border/60 bg-muted/30 p-4">
            <div>
              <Label>{t('auth.register.distributionRulesTitle')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('auth.register.distributionRulesSubtitle')}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t('auth.register.businessFund')}</span>
                <span className="font-mono text-primary">{businessFundPercent}%</span>
              </div>
             <Slider
              value={[businessFundPercent]}
              min={0}
              max={100}
              step={5}
              onValueChange={(values: number | readonly number[]) => {
                const val = Array.isArray(values) ? values[0] : values;
                setValue('businessFundPercent', val, { shouldValidate: true, shouldDirty: true });
                setValue('personalProfitPercent', 100 - val, { shouldValidate: true, shouldDirty: true });
              }}
            />
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t('auth.register.personalProfit')}</span>
                <span className="font-mono text-primary">{personalProfitPercent}%</span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {t('auth.register.submitButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.register.alreadyHaveAccount')}{' '}
            <Link
              to="/auth/login"
              className="font-medium text-primary hover:underline"
            >
              {t('auth.register.signInLink')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}