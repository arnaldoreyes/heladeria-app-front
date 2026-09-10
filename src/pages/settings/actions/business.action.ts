import { iceApi } from '@/api/iceApi';
import type { BusinessFormData } from '../schemas/settings.schema';

export const getBusinessAction = async (): Promise<BusinessFormData> => {
  const response = await iceApi.get('/businesses/current');
  
  const rawData = response.data?.data || response.data;
  const settings = rawData?.settings || {};

  return {
    id: rawData.id,
    name: rawData.name || '',
    niche: rawData.niche || '',
    default_profit_percentage: Number(settings.default_profit_percentage ?? 40),
    default_reinvestment_percentage: Number(settings.default_reinvestment_percentage ?? 60),
    print_ticket_on_sale: Boolean(settings.print_ticket_on_sale),
    ticket_header_notes: settings.ticket_header_notes || '',
    ticket_footer_notes: settings.ticket_footer_notes || '',
  };
};

export const updateBusinessAction = async (formData: BusinessFormData) => {
  const payload = {
    name: formData.name,
    niche: formData.niche,
    settings: {
      default_profit_percentage: formData.default_profit_percentage,
      default_reinvestment_percentage: formData.default_reinvestment_percentage,
      print_ticket_on_sale: formData.print_ticket_on_sale,
      ticket_header_notes: formData.ticket_header_notes,
      ticket_footer_notes: formData.ticket_footer_notes,
    },
  };

  const { data } = await iceApi.put(`/businesses/${formData.id}`, payload);
  return data;
};