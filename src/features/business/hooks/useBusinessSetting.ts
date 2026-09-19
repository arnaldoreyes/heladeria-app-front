import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getBusinessAction, updateBusinessAction } from '../actions/business-setting.action';
import { businessSchema, type BusinessFormData } from '../schemas/business-setting.schema';
import type { ErrorResponse } from '@/interfaces/api.interface';

const DEFAULT_BUSINESS_VALUES: BusinessFormData = {
  name: '',
  niche: '',
  default_profit_percentage: 40,
  default_reinvestment_percentage: 60,    
  print_ticket_on_sale: false,
  ticket_header_notes: '',
  ticket_footer_notes: '',
};

/**
 * Custom Hook para la gestión de la configuración general del negocio.
 */
export function useBusinessSetting() {
  const { t } = useTranslation(['settings', 'common']);
  const queryClient = useQueryClient();

  // 1. Obtención de datos del servidor
  const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
    queryKey: ['settings', 'business'],
    queryFn: getBusinessAction,
    staleTime: 1000 * 60 * 30, // 30 minutos de caché (rara vez cambia externamente)
  });

  // 2. Inicialización del Formulario con sincronización automática
  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    mode: 'onTouched',
    values: businessData || DEFAULT_BUSINESS_VALUES,
    defaultValues: DEFAULT_BUSINESS_VALUES,
  });

  const { control, setValue, formState: { isSubmitting, isDirty } } = form;

  // 3. Suscripciones aisladas y seguras mediante useWatch
  const printTicketOnSale = useWatch({ control, name: 'print_ticket_on_sale' });
  const defaultReinvestment = useWatch({ control, name: 'default_reinvestment_percentage' });
  const defaultProfit = useWatch({ control, name: 'default_profit_percentage' });

  // 4. Mutación para guardar cambios
  const mutation = useMutation({
    mutationFn: updateBusinessAction,
    onSuccess: (updatedData) => {
      toast.success(t('settings.business.successMsg', 'Configuración guardada correctamente'));
      
      // Actualizamos directamente la caché para respuesta instantánea sin refetch
      queryClient.setQueryData(['settings', 'business'], updatedData);
      queryClient.invalidateQueries({ queryKey: ['settings', 'business'] });

      // Reseteamos el estado dirty del formulario alineándolo con la data guardada
      if (updatedData) {
        form.reset(updatedData);
      }
    },
    onError: (error: ErrorResponse) => {
      toast.error(error?.message || t('settings.business.errorMsg', 'Ocurrió un error al guardar'));
    },
  });

  // Handlers
  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  const updateDistribution = (businessVal: number, personalVal: number) => {
    setValue('default_reinvestment_percentage', businessVal, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
    setValue('default_profit_percentage', personalVal, { 
      shouldValidate: true, 
      shouldDirty: true 
    });
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