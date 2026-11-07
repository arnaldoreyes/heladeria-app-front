import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  identification?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  currency: string; // 'USD' | 'VES' | 'BS'
  bank_name?: string;
  payment_type_id?: string;
}

export interface SalePayment {
  payment_method_id: string;
  method: PaymentMethod;
  currency: string;
  amount_original: number;
  amount_usd: number;
  amount_bs: number;
  reference?: string;
  exchange_rate: number;
  notes?: string | null;
}

export interface SaleItem {
  product_id: string;
  quantity: number;
  max_stock: number;
  unit_price_usd: number;
  unit_cost_usd: number;
  unit_price_bs?: number;
  unit_cost_bs?: number;
  subtotal_usd?: number;
  subtotal_bs?: number;
  cost_usd?: number;
  cost_bs?: number;
}

interface CartState {
  items: SaleItem[];
  customer: Customer | null;
  exchangeRate: number;
  isMixedPayment: boolean;
  payments: SalePayment[];
  currentStep: 1 | 2;

  setCurrentStep: (step: 1 | 2) => void;
  setCustomer: (customer: Customer | null) => void;

  isCostSale: boolean;
  setIsCostSale: (isCost: boolean) => void;

  getItemPrice: (item: SaleItem) => number;

  addItem: (product: Omit<SaleItem, 'quantity' | 'subtotal_usd' | 'subtotal_bs' | 'cost_usd' | 'cost_bs' | 'unit_price_bs' | 'unit_cost_bs'>) => void;
  removeItem: (product_id: string) => void;
  updateQuantity: (product_id: string, quantity: number) => void;
  clearCart: () => void;

  setExchangeRate: (rate: number) => void;
  setIsMixedPayment: (isMixed: boolean) => void;
  addPaymentSplit: (method: PaymentMethod, amountInput: number, reference?: string) => void;
  removePaymentSplit: (index: number) => void;
  clearPayments: () => void;

  getTotalUsd: () => number;
  getTotalBs: () => number;
  getPaidTotalUsd: () => number;
  getPaidTotalBs: () => number;
  getRemainingUsd: () => number;
  getRemainingBs: () => number;
}

const roundTwoDecimals = (num: number): number => Math.round((num + Number.EPSILON) * 100) / 100;
const isBsCurrency = (currency?: string) => currency === 'VES' || currency === 'BS';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customer: null,
      exchangeRate: 0,
      isMixedPayment: false,
      currentStep: 1,
      payments: [],
      isCostSale: false,

      setCurrentStep: (currentStep) => set({ currentStep }),

      setCustomer: (customer) => set({ customer }),

      setIsCostSale: (isCostSale) => {
        set({ isCostSale });
      },

      getItemPrice: (item: SaleItem) => {
        return get().isCostSale ? item.unit_cost_usd : item.unit_price_usd;
      },

      getTotalUsd: () => {
        const total = get().items.reduce((acc, item) => {
          const unitPrice = get().getItemPrice(item);
          return acc + unitPrice * item.quantity;
        }, 0);
        return roundTwoDecimals(total);
      },

      getTotalBs: () => {
        return roundTwoDecimals(get().getTotalUsd() * get().exchangeRate);
      },

      addItem: (product) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.product_id === product.product_id);
        const rate = get().exchangeRate;

        const unitPriceUsd = product.unit_price_usd || 0;
        const unitCostUsd = product.unit_cost_usd || 0;

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const currentQty = updatedItems[existingIndex].quantity;

          if (currentQty + 1 <= product.max_stock) {
            const newQty = currentQty + 1;
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: newQty,
              unit_price_usd: unitPriceUsd,
              unit_cost_usd: unitCostUsd,
              unit_price_bs: unitPriceUsd * rate,
              unit_cost_bs: unitCostUsd * rate,
              subtotal_usd: unitPriceUsd * newQty,
              subtotal_bs: (unitPriceUsd * newQty) * rate,
              cost_usd: unitCostUsd * newQty,
              cost_bs: (unitCostUsd * newQty) * rate,
            };
            set({ items: updatedItems });
          }
        } else {
          if (product.max_stock > 0) {
            set({
              items: [
                ...items,
                {
                  ...product,
                  quantity: 1,
                  unit_price_usd: unitPriceUsd,
                  unit_cost_usd: unitCostUsd,
                  unit_price_bs: unitPriceUsd * rate,
                  unit_cost_bs: unitCostUsd * rate,
                  subtotal_usd: unitPriceUsd,
                  subtotal_bs: unitPriceUsd * rate,
                  cost_usd: unitCostUsd,
                  cost_bs: unitCostUsd * rate,
                },
              ],
            });
          }
        }
      },

      removeItem: (product_id) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== product_id),
        }));
      },

      updateQuantity: (product_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(product_id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product_id === product_id) {
              const newQty = Math.min(quantity, item.max_stock);
              return {
                ...item,
                quantity: newQty,
                subtotal_usd: item.unit_price_usd * newQty,
                subtotal_bs: item.unit_price_bs ? item.unit_price_bs * newQty : 0,
                cost_usd: item.unit_cost_usd * newQty,
                cost_bs: item.unit_cost_bs ? item.unit_cost_bs * newQty : 0,
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          customer: null,
          payments: [],
          isMixedPayment: false,
          currentStep: 1,
        });
      },

      setExchangeRate: (exchangeRate) => set({ exchangeRate }),

      setIsMixedPayment: (isMixedPayment) => set({ isMixedPayment, payments: [] }),

      addPaymentSplit: (method, amountInput, reference = '') => {
        const rate = get().exchangeRate || 1;
        const isBs = isBsCurrency(method.currency);

        const amountUsd = isBs ? roundTwoDecimals(amountInput / rate) : amountInput;
        const amountBs = isBs ? amountInput : roundTwoDecimals(amountInput * rate);

        console.log('Adding payment split:', { method, amountInput, amountUsd, amountBs, reference });

        const newPayment: SalePayment = {
          payment_method_id: method.id,
          method,
          currency: method.currency,
          amount_original: amountInput,
          amount_usd: amountUsd,
          amount_bs: amountBs,
          reference,
          exchange_rate: rate,
          notes: method.bank_name ? `Banco: ${method.bank_name}` : null,
        };

        set((state) => ({
          payments: [...state.payments, newPayment],
        }));
      },

      removePaymentSplit: (index) => {
        set((state) => ({
          payments: state.payments.filter((_, i) => i !== index),
        }));
      },

      clearPayments: () => set({ payments: [] }),

      getPaidTotalUsd: () => {
        const paidSum = get().payments.reduce((acc, p) => acc + (p.amount_usd || 0), 0);
        return roundTwoDecimals(paidSum);
      },

      getPaidTotalBs: () => {
        const paidSumBs = get().payments.reduce((acc, p) => acc + (p.amount_bs || 0), 0);
        return roundTwoDecimals(paidSumBs);
      },

      getRemainingUsd: () => {
        const remaining = get().getTotalUsd() - get().getPaidTotalUsd();
        return remaining > 0 ? roundTwoDecimals(remaining) : 0;
      },

      getRemainingBs: () => {
        const remaining = get().getTotalBs() - get().getPaidTotalBs();
        return remaining > 0 ? roundTwoDecimals(remaining) : 0;
      },
    }),
    {
      name: 'ice-cart-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        items: state.items,
        customer: state.customer,
        currentStep: state.currentStep,
        isCostSale: state.isCostSale,
        payments: state.payments,
        isMixedPayment: state.isMixedPayment,
      }),
    }
  )
);