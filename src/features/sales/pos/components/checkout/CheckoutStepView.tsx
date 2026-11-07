import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { CustomerSection } from './CustomerSection';
import { DiscountSection } from './DiscountSection';
import { formatUsd } from '@/lib/format';
import { useCartStore } from '../../hooks/useCartStore';
//import { useCreateSale } from '../../hooks/useSales';
import { PaymentSection } from './PaymentSection';
import { CartTotals } from '../cart/CartTotals';
//import { ShareOrderWhatsAppDialog } from './ShareOrderWhatsAppDialog';
import type { DiscountType, SaleItem } from '@/interfaces/sale.interfce';
import { Switch } from '@/components/ui/switch';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SaleTypeMode } from './SaleTypeSelector';

interface CheckoutStepViewProps {
  items: SaleItem[];
  exchangeRate: number;
  onBack: () => void;
  onSuccess: () => void;
  onAddNewCustomer?: () => void;
}

export function CheckoutStepView({
  items,
  exchangeRate,
  onBack,
  onAddNewCustomer,
}: CheckoutStepViewProps) {
  const {
    getTotalUsd,
    isCostSale    
  } = useCartStore();


  // Estado Modalidad y Cliente
  const [customerId, setCustomerId] = useState<string>('');
  const [saleTypeMode, setSaleTypeMode] = useState<SaleTypeMode>('retail');
  const [showCustomer, setShowCustomer] = useState(false);

  // Descuento
  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValueInput, setDiscountValueInput] = useState<string>('');


  // Cálcules de Totales desde el Store (ya incluye la lógica de costo si isCostSale es true)
  const isEmployeeSale = saleTypeMode === 'employee';

  const subtotalUsd = getTotalUsd();

  const rawDiscountVal = parseFloat(discountValueInput) || 0;
  let discountUsd = 0;
  if (rawDiscountVal > 0 && !isEmployeeSale) {
    if (discountType === 'percentage') {
      discountUsd = (subtotalUsd * Math.min(rawDiscountVal, 100)) / 100;
    } else {
      discountUsd = Math.min(rawDiscountVal, subtotalUsd);
    }
  }

  //const discountBs = Number((discountUsd * exchangeRate).toFixed(2));
  const totalUsd = Math.max(0, subtotalUsd - discountUsd);
  const totalBs = Number((totalUsd * exchangeRate).toFixed(2));

  const isCustomerOpen = showCustomer || Boolean(customerId && customerId !== 'guest');

  // --- Mapeo universal de pagos (Soporta Pago Único y Pago Mixto) ---
  /*
  const currentPayments = payments.map((p) => {
        const masterMethod = activePaymentMethods.find((m) => m.id === p.payment_method_id);
        
        return {
          ...masterMethod,
          ...p,
          method: p.method || masterMethod?.name,
          amount_usd: p.amount_usd ?? (p as any).amountUsd ?? 0,
          amount_bs: p.amount_bs ?? (p as any).amountBs ?? 0,
          
        };
      })
    : [];
*/

  

  const handleConfirmCheckout = () => {
  }
  /*
  const handleConfirmCheckout = () => {
    const isCreditToCustomer = excessUsd > 0 && overpaymentAction === 'customer_credit';

    let finalPayments = currentPayments;

    if (isCreditSale && currentPaidUsd === 0) {
      finalPayments = [];
    }

    let paymentStatus: 'paid' | 'partial' | 'pending' = 'paid';
    if (pendingUsd >= totalUsd) {
      paymentStatus = 'pending';
    } else if (pendingUsd > 0) {
      paymentStatus = 'partial';
    }

    createSale(
      {
        payment_status: paymentStatus,
        total_usd: totalUsd,
        total_bs: totalBs,
        discount_usd: discountUsd,
        discount_bs: discountBs,
        paid_usd: currentPaidUsd,
        pending_usd: pendingUsd,
        exchange_rate: exchangeRate,
        exchange_rate_date: new Date().toISOString(),
        change_loss_bs: 0,
        overpayment_bs: overpaymentAction === 'change' ? excessBs : 0,
        add_to_customer_credit: isCreditToCustomer,
        customer_credit_usd: isCreditToCustomer ? excessUsd : 0,
        customer_credit_bs: isCreditToCustomer ? excessBs : 0,
        items: items.map((i) => {
          const rawCost = i.costUsd ?? i.cost_usd ?? (i as any).cost;
          const hasValidCost = typeof rawCost === 'number' && !isNaN(rawCost);
          const unitPriceUsd = isEmployeeSale && hasValidCost ? rawCost : i.priceUsd;

          return {
            product_id: i.productId,
            quantity: i.quantity,
            unit_price_usd: unitPriceUsd,
            unit_price_bs: Number((unitPriceUsd * exchangeRate).toFixed(2)),
          };
        }),
      },
      {
        onSuccess: () => onSuccess(),
      }
    );
  };
*/
  const isSubmitDisabled = true; // Aquí puedes agregar la lógica para habilitar/deshabilitar el botón de confirmación según tus necesidades

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden">
      <DialogHeader className="border-b border-border/60 px-5 py-4 flex-row items-center gap-3 space-y-0">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <DialogTitle>Finalizar Pago</DialogTitle>
          <p>{items.length} productos a procesar</p>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Switch de Venta al Costo */}
        <div className="flex items-center justify-between rounded-lg border border-border/60 p-3 bg-muted/30">
          <div className="space-y-0.5">
            <label htmlFor="cost-sale-toggle" className="text-sm font-medium cursor-pointer">
              Consumo / Venta al Costo
            </label>
            <p className="text-xs text-muted-foreground">
              Aplica el costo de reposición a los productos
            </p>
          </div>
          <Switch
            id="cost-sale-toggle"
            checked={isCostSale}
            onCheckedChange={setSaleTypeMode.bind(null, isCostSale ? 'retail' : 'employee')}
          />
        </div>
        

        <CustomerSection
          customerId={customerId}
          requiresCustomer={false}
          isOpen={isCustomerOpen}
          onToggleOpen={() => setShowCustomer(!showCustomer)}
          onSelectCustomer={setCustomerId}
          onAddNewCustomer={onAddNewCustomer}
        />

        {!isEmployeeSale && (
          <DiscountSection
            showDiscount={showDiscount}
            discountType={discountType}
            discountValueInput={discountValueInput}
            discountUsd={discountUsd}
            onToggleShow={() => setShowDiscount(!showDiscount)}
            onChangeType={setDiscountType}
            onChangeValue={setDiscountValueInput}
          />
        )}

        <div className="space-y-2">
          <PaymentSection/>        

          {/* Diálogo de WhatsApp integrado con teléfono del cliente
          
          <ShareOrderWhatsAppDialog
            items={items as any}
            totalUsd={totalUsd}
            totalBs={totalBs}
            pendingUsd={pendingUsd}
            pendingBs={pendingBs}
            paidUsd={currentPaidUsd}
            paidBs={Number((currentPaidUsd * exchangeRate).toFixed(2))}
            exchangeRate={exchangeRate}
            saleType={saleTypeMode}
            payments={currentPayments as any}
            //customerPhone={selectedCustomerPhone}
          />
           */}
        </div>
      </div>

      {items.length > 0 && (
        <div className="border-t border-border/60 p-4">
          <CartTotals
            totalUsd={totalUsd}
            totalBs={totalBs}
            exchangeRate={exchangeRate}
          />

          <div className="flex gap-2 mt-4">
            <Button
              className="w-full font-bold"
              size="lg"
              onClick={handleConfirmCheckout}
              disabled={isSubmitDisabled}
            >
              { `Confirmar Venta · ${formatUsd(totalUsd)}`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}