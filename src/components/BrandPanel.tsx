import { Snowflake } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BrandPanel() {
  const { t } = useTranslation();

  return (
    <div className="relative hidden flex-1 flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-white blur-3xl" />
      </div>

      <div className="relative flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
          <Snowflake className="h-6 w-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">Ice King</span>
      </div>

      <div className="relative space-y-4">
        <h1 className="text-4xl font-bold leading-tight">
          {t('auth.brand.heading')}
        </h1>
        <p className="max-w-md text-lg text-primary-foreground/80">
          {t('auth.brand.description')}
        </p>
        <div className="flex gap-3 pt-2">
          <span className="rounded-lg bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
            $ USD
          </span>
          <span className="rounded-lg bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
            Bs. Bolívares
          </span>
          <span className="rounded-lg bg-white/15 px-3 py-1 text-sm font-medium backdrop-blur">
            BCV Live Rate
          </span>
        </div>
      </div>

      <p className="relative text-sm text-primary-foreground/60">
        © 2026 Ice King Platform
      </p>
    </div>
  );
}