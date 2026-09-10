
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DistributionRulesSlider } from '@/components/custom/DistributionRulesSlider';
import { useBusinessSettings } from './hooks/useBusinessSettings';


export default function BusinessSettings() {
  const { t } = useTranslation();
  const {
    form,
    isLoading,
    isPending,
    onSubmit,
    printTicketOnSale,
    businessFundPercent,
    personalProfitPercent,
    updateDistribution,
  } = useBusinessSettings();

  const { register, setValue, formState: { errors } } = form;

  if (isLoading) {
    return <div className="animate-pulse space-y-6 h-full bg-muted/20 rounded-xl" />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      
      {/* SECCIÓN 1: Información General */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.business.generalInfo', 'Información General')}</CardTitle>
          <CardDescription>{t('settings.business.generalInfoDesc', 'Datos básicos de tu comercio.')}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('settings.business.name', 'Nombre del Negocio')}</Label>
            <Input
              id="name"
              placeholder="Ej. Inversiones ACME"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="niche">{t('settings.business.niche', 'Nicho / Rubro')}</Label>
            <Input
              id="niche"
              placeholder="Ej. Ferretería, Bodegón..."
              {...register('niche')}
            />
            {errors.niche && (
              <p className="text-xs text-destructive">{errors.niche.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: Economía y Tasas */}
      <DistributionRulesSlider
          businessFundPercent={businessFundPercent}
          personalProfitPercent={personalProfitPercent}
          onChange={updateDistribution}
        />

      {/* SECCIÓN 3: Facturación y Tickets */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.business.tickets', 'Tickets y Facturación')}</CardTitle>
          <CardDescription>{t('settings.business.ticketsDesc', 'Personaliza el comportamiento y diseño de tus recibos.')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base">
                {t('settings.business.autoPrint', 'Impresión Automática')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('settings.business.autoPrintDesc', 'Imprimir el ticket automáticamente al concretar una venta.')}
              </p>
            </div>
            <Switch
              checked={printTicketOnSale}
              onCheckedChange={(checked) => 
                setValue('print_ticket_on_sale', checked, { shouldValidate: true })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_header_notes">
              {t('settings.business.ticketHeader', 'Notas en Cabecera (Opcional)')}
            </Label>
            <Textarea
              id="ticket_header_notes"
              placeholder="Ej. RIF, Dirección de la sucursal..."
              className="resize-none"
              {...register('ticket_header_notes')}
            />
            {errors.ticket_header_notes && (
              <p className="text-xs text-destructive">{errors.ticket_header_notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_footer_notes">
              {t('settings.business.ticketFooter', 'Notas en Pie de Página (Opcional)')}
            </Label>
            <Textarea
              id="ticket_footer_notes"
              placeholder="Ej. ¡Gracias por su compra! No se aceptan devoluciones..."
              className="resize-none"
              {...register('ticket_footer_notes')}
            />
            {errors.ticket_footer_notes && (
              <p className="text-xs text-destructive">{errors.ticket_footer_notes.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending 
            ? t('common.saving', 'Guardando...') 
            : t('common.saveChanges', 'Guardar Cambios')}
        </Button>
      </div>
    </form>
  );
}