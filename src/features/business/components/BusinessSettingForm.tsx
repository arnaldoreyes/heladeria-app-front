import { useTranslation } from "react-i18next";
import { Store, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { FormSectionCard } from "@/components/form/FormSectionCard";
import { FormSaveButton } from "@/components/form/FormSaveButton";
import { InputError } from "@/components/form/InputError";
import { DistributionRulesSlider } from "@/components/custom/DistributionRulesSlider";
import { useBusinessSetting } from "../hooks/useBusinessSetting";


export function BusinessSettingForm() {
  const { t } = useTranslation();
  const {
    form,
    isLoading,
    isSaving,
    isDirty,
    printTicketOnSale,
    businessFundPercent,
    personalProfitPercent,
    onSubmit,
    updateDistribution,
  } = useBusinessSetting();

  const {
    register,
    setValue,
    formState: { errors },
  } = form;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6 h-96 bg-muted/20 rounded-xl" />
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* SECCIÓN 1: Información General */}
      <FormSectionCard
        title={t("settings.business.generalInfo", "Información General")}
        description={t(
          "settings.business.generalInfoDesc",
          "Datos básicos de tu comercio."
        )}
        contentClassName="grid grid-cols-1 md:grid-cols-2 gap-6"
        icon={Store}
      >
        <div className="space-y-2">
          <Label htmlFor="name">
            {t("settings.business.name", "Nombre del Negocio")}
          </Label>
          <Input
            id="name"
            placeholder="Ej. Inversiones ACME"
            {...register("name")}
          />
          <InputError message={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="niche">
            {t("settings.business.niche", "Nicho / Rubro")}
          </Label>
          <Input
            id="niche"
            placeholder="Ej. Ferretería, Bodegón..."
            {...register("niche")}
          />
          <InputError message={errors.niche?.message} />
        </div>
      </FormSectionCard>

      {/* SECCIÓN 2: Economía y Tasas */}
      <DistributionRulesSlider
        businessFundPercent={businessFundPercent}
        personalProfitPercent={personalProfitPercent}
        onChange={updateDistribution}
      />

      {/* SECCIÓN 3: Facturación y Tickets */}
      <FormSectionCard
        title={t("settings.business.tickets", "Tickets y Facturación")}
        description={t(
          "settings.business.ticketsDesc",
          "Personaliza el comportamiento y diseño de tus recibos."
        )}
        icon={Receipt}
        contentClassName="grid grid-cols-1 gap-6"
      >
        {/* Opción de Impresión Automática */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5">
            <Label
              className="text-base font-medium cursor-pointer"
              htmlFor="auto-print-switch"
            >
              {t("settings.business.autoPrint", "Impresión Automática")}
            </Label>
            <p className="text-xs text-muted-foreground">
              {t(
                "settings.business.autoPrintDesc",
                "Imprimir el ticket automáticamente al concretar una venta."
              )}
            </p>
          </div>
          <Switch
            id="auto-print-switch"
            checked={printTicketOnSale}
            onCheckedChange={(checked) =>
              setValue("print_ticket_on_sale", checked, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </div>

        {/* Inputs de Notas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ticket_header_notes">
              {t(
                "settings.business.ticketHeader",
                "Notas en Cabecera (Opcional)"
              )}
            </Label>
            <Textarea
              id="ticket_header_notes"
              placeholder="Ej. RIF, Dirección de la sucursal..."
              className="resize-none min-h-[100px]"
              {...register("ticket_header_notes")}
            />
            <InputError message={errors.ticket_header_notes?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ticket_footer_notes">
              {t(
                "settings.business.ticketFooter",
                "Notas en Pie de Página (Opcional)"
              )}
            </Label>
            <Textarea
              id="ticket_footer_notes"
              placeholder="Ej. ¡Gracias por su compra! No se aceptan devoluciones..."
              className="resize-none min-h-[100px]"
              {...register("ticket_footer_notes")}
            />
            <InputError message={errors.ticket_footer_notes?.message} />
          </div>
        </div>
      </FormSectionCard>

      <div className="flex justify-end">
        <FormSaveButton isSaving={isSaving} isDirty={isDirty} />
      </div>
    </form>
  );
}