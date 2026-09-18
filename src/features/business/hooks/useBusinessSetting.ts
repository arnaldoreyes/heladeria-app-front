import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getBusinessAction, updateBusinessAction } from '../actions/business-setting.action';
import { businessSchema, type BusinessFormData } from '../schemas/business-setting.schema';

/**
 * Custom Hook para la gestión de la configuración general del negocio.
 * 
 * Orquesta la lectura de datos desde la API via TanStack Query, el estado local
 * y validación del formulario con React Hook Form + Zod, y el envío de mutaciones.
 * 
 * @returns Objeto con instancia del formulario, estados de carga, manejador de submit y Helpers de UI.
 */
export function useBusinessSetting() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // 1. Obtención de datos del servidor
  const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ['settings', 'business'],
    queryFn: getBusinessAction,
  });

  // 2. Inicialización del Formulario
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    mode: 'onTouched',
    values: businessData, 
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      name: '',
      niche: '',
      default_profit_percentage: 40,
      default_reinvestment_percentage: 60,
      print_ticket_on_sale: false,
      ticket_header_notes: '',
      ticket_footer_notes: '',
    },
  });

  const { control, setValue, formState: { isSubmitting, isDirty } } = form;

  // 2. Suscripciones aisladas y seguras para el React Compiler mediante useWatch
  const printTicketOnSale = useWatch({
    control,
    name: 'print_ticket_on_sale',
  });

  const defaultReinvestment = useWatch({
    control,
    name: 'default_reinvestment_percentage',
  });

  const defaultProfit = useWatch({
    control,
    name: 'default_profit_percentage',
  });

  // 3. Mutación para guardar cambios
  const mutation = useMutation({
    mutationFn: updateBusinessAction,
    onSuccess: () => {
      toast.success(t('settings.business.successMsg', 'Configuración guardada correctamente'));
      queryClient.invalidateQueries({ queryKey: ['settings', 'business'] });
    },
    onError: () => {
      toast.error(t('settings.business.errorMsg', 'Ocurrió un error al guardar'));
    },
  });

  /**
   * Procesa la sumisión del formulario validado.
   */
  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  /**
   * Actualiza atómicamente la distribución de ganancias y reinversión.
   * Modifica el estado dirty y fuerza la re-validación.
   */
  const updateDistribution = (businessVal: number, personalVal: number) => {
    setValue('default_reinvestment_percentage', businessVal, { shouldValidate: true, shouldDirty: true });
    setValue('default_profit_percentage', personalVal, { shouldValidate: true, shouldDirty: true });
  };

  return {
    form,
    isLoading: isLoadingBusiness,
    isSaving: mutation.isPending || isSubmitting,
    isDirty,
    printTicketOnSale,
    businessFundPercent: defaultReinvestment ?? 60,
    personalProfitPercent: defaultProfit ?? 40,

    onSubmit,
    updateDistribution,
  };
}