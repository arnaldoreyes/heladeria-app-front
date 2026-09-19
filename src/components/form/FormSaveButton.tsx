import type { ComponentProps } from "react"
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button" // Reemplaza por la ruta de tu componente Button

interface FormSaveButtonProps extends ComponentProps<typeof Button> {
  isSaving: boolean
  isDirty?: boolean
  label?: string
  loadingLabel?: string
}

export function FormSaveButton({
  isSaving,
  isDirty = true,
  label,
  loadingLabel,
  disabled,
  children,
  className,
  ...props
}: FormSaveButtonProps) {
  const { t } = useTranslation()
  const isDisabled = isSaving || !isDirty || disabled

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      className={className}
      {...props}
    >
      {isSaving ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingLabel ?? t("common.saving", "Guardando...")}
        </>
      ) : (
        children ?? label ?? t("common.saveChanges", "Guardar Cambios")
      )}
    </Button>
  )
}