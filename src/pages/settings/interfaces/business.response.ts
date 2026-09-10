
export interface BusinessApiResponse {
  id: string;
  name: string;
  slug: string;
  niche: string;
  status: string;
  logo_url: string | null;
  settings: {
    id: string;
    business_id: string;
    bcv_mode: 'auto' | 'manual';
    default_profit_percentage: number;
    default_reinvestment_percentage: number;
    print_ticket_on_sale: boolean;
    ticket_header_notes: string | null;
    ticket_footer_notes: string | null;
  };
}