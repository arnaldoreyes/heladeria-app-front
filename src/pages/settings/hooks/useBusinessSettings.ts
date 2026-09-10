import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getBusinessAction, updateBusinessAction } from '../actions/business.action';
import { businessSchema, type BusinessFormData } from '../schemas/settings.schema';

export function useBusinessSettings() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: businessData, isLoading } = useQuery({
    queryKey: ['settings', 'business'],
    queryFn: getBusinessAction,
  });

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    values: businessData, 
    resetOptions: {
      keepDefaultValues: false,
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

  const { watch, setValue } = form;

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

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values);
  });

  return {
    form,
    isLoading,
    isPending: mutation.isPending,
    onSubmit,
    printTicketOnSale: watch('print_ticket_on_sale'),
    businessFundPercent: watch('default_reinvestment_percentage') ?? 60,
    personalProfitPercent: watch('default_profit_percentage') ?? 40,
    updateDistribution: (businessVal: number, personalVal: number) => {
      setValue('default_reinvestment_percentage', businessVal, { shouldValidate: true, shouldDirty: true });
      setValue('default_profit_percentage', personalVal, { shouldValidate: true, shouldDirty: true });
    },
  };
}