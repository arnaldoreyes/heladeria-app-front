import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { CheckoutStepView } from './checkout/CheckoutStepView';
import { CartStepView } from './cart/CartStepView';
import { useCustomers } from '@/features/customers/hooks/useCustomers';
import { CustomerDialog } from '@/features/customers/components/CustomerDialog';
import type { SaleItem } from '@/interfaces/sale.interfce';

export interface CartItem {
  productId: string;
  name: string;
  priceUsd: number;
  costUsd?: number;
  quantity: number;
  maxStock: number;
}

type Step = 'cart' | 'checkout';

interface PosCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: SaleItem[];
  totalUsd: number;
  totalBs: number;
  exchangeRate: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function PosCheckoutDialog({ 
  open,
  onOpenChange,
  items,
  totalUsd: cartTotalUsd,
  totalBs: cartTotalBs,
  exchangeRate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: PosCheckoutDialogProps) {
  const [step, setStep] = useState<Step>('cart');

  const {
    isModalOpen,
    closeModal,
    openModal,
    form,
    onSubmit,
    isSaving,
    isDirty,
    isEditing,
  } = useCustomers();

  // Cierra el Modal y resetea el paso con delay para no cortar la animación de salida
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setTimeout(() => setStep('cart'), 250);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="flex flex-col p-0 w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-hidden">
          
          {step === 'cart' ? (
            <CartStepView
              items={items}
              totalUsd={cartTotalUsd}
              totalBs={cartTotalBs}
              exchangeRate={exchangeRate}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onClearCart={onClearCart}
              onProceedToCheckout={() => setStep('checkout')}
            />
          ) : (
            <CheckoutStepView
              items={items}
              exchangeRate={exchangeRate}
              onBack={() => setStep('cart')}
              onSuccess={() => handleOpenChange(false)}
              onAddNewCustomer={() => openModal()}
            />
          )}
        </DialogContent>
      </Dialog>

      <CustomerDialog
        isOpen={isModalOpen}
        onOpenChange={(isModalOpen) => !isModalOpen && closeModal()}
        isEditing={isEditing}
        form={form}
        onSubmit={onSubmit}
        isSaving={isSaving}
        isDirty={isDirty}
      />
    </>
  );
}