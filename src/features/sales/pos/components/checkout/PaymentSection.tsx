import { 
  Trash2, 
  BadgeCheck, 
  Plus, 
  X,
  CreditCard,
  Split,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatUsd, formatBs } from '@/lib/format';
import { PaymentMethodSelect } from '@/features/payment-methods/components/PaymentMethodSelect';
import { useCartStore } from '../../hooks/useCartStore';
import { useState, useEffect } from 'react';
import type { OverpaymentAction } from './OverpaymentSection';
import { OverpaymentSection } from './OverpaymentSection';
import { usePaymentMethods } from '@/features/payment-methods/hooks/usePaymentMethods';

const isBsCurrency = (currency?: string) => currency === 'VES' || currency === 'BS';

export function PaymentSection() {
  const {
    payments,
    addPaymentSplit,
    removePaymentSplit,
    getTotalUsd,
    getRemainingUsd,
    getRemainingBs,
    exchangeRate,
  } = useCartStore();

  const { methods: paymentMethods, isLoadingMethods } = usePaymentMethods({
    is_active: true,
  });

  // Acción sobre sobrepago / excedente
  const [overpaymentAction, setOverpaymentAction] = useState<OverpaymentAction>('change');
  const [isPartialMode, setPartialMode] = useState(false);
  const [showRefInput, setShowRefInput] = useState(false);

  // Estados locales para el formulario de pago actual
  const [splitMethodId, setSplitMethodId] = useState<string>('');
  const [splitAmountInput, setSplitAmountInput] = useState<string>('');
  const [splitRef, setSplitRef] = useState<string>('');

  // Método de pago actualmente seleccionado
  const selectedSplitMethod = paymentMethods.find((m) => m.id === splitMethodId);
  const isSplitBs = isBsCurrency(selectedSplitMethod?.currency);

  const pendingUsd = getRemainingUsd();
  const pendingBs = getRemainingBs();
  const totalUsd = getTotalUsd();

  // Calcular excedentes si el monto ingresado supera el pendiente
  const numericInput = parseFloat(splitAmountInput) || 0;
  const currentPending = isSplitBs ? pendingBs : pendingUsd;
  const excess = Math.max(0, numericInput - currentPending);
  const excessUsd = isSplitBs ? (exchangeRate > 0 ? excess / exchangeRate : 0) : excess;
  const excessBs = isSplitBs ? excess : excess * exchangeRate;

  // Auto-completar el monto restante al cambiar de método o alternar modos
  useEffect(() => {
    if (selectedSplitMethod) {
      const fullAmount = isSplitBs ? pendingBs : pendingUsd;
      if (!isPartialMode || !splitAmountInput) {
        setSplitAmountInput(fullAmount > 0 ? fullAmount.toFixed(2) : '');
      }
    }
  }, [selectedSplitMethod, pendingUsd, pendingBs, isSplitBs, isPartialMode]);

  const handleTogglePartialMode = (checked: boolean) => {
    setPartialMode(checked);
    if (!checked && selectedSplitMethod) {
      const fullAmount = isSplitBs ? pendingBs : pendingUsd;
      setSplitAmountInput(fullAmount.toFixed(2));
    }
  };

  const handleAddPayment = () => {
    if (!splitMethodId || !splitAmountInput || numericInput <= 0 || !selectedSplitMethod) return;

    addPaymentSplit(selectedSplitMethod, numericInput, splitRef);

    // Resetear campos del formulario
    setSplitAmountInput('');
    setSplitRef('');
    setShowRefInput(false);
  };

  return (
    <div className="space-y-3.5 w-full">
      {/* Formulario de Pago con Switch Integrado */}
      {pendingUsd > 0.01 ? (
        <div className="p-3 rounded-xl border bg-muted/20 space-y-3">
          
          {/* Header con monto restante */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1 text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5" />
              {payments.length ? 'Agregar otro método' : 'Método de Pago'}
            </span>
           <div className="flex items-center gap-2">
              <Switch
                id="partial-mode"
                checked={isPartialMode}
                onCheckedChange={handleTogglePartialMode}
                disabled={payments.length > 0} 
              />
              <Label htmlFor="partial-mode" className="text-xs font-semibold cursor-pointer">
                {isPartialMode ? 'Pago Parcial' : 'Pago Total'}
              </Label>
            </div>
          </div>

          {/* Selector de Método de Pago */}
          <PaymentMethodSelect
            value={splitMethodId}
            label=""
            onChange={(id) => setSplitMethodId(id ?? '')}
            showNoneOption={false}
            disabled={isLoadingMethods}
            placeholder="Seleccionar método"
          />

          {/* Nº de Referencia Opcional */}
          <div className="pt-0.5">
            {!showRefInput && !splitRef ? (
              <button
                type="button"
                onClick={() => setShowRefInput(true)}
                className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
              >
                <Plus className="h-3 w-3" /> Agregar nº de referencia (Opcional)
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Nº Referencia / Comprobante"
                  value={splitRef}
                  onChange={(e) => setSplitRef(e.target.value)}
                  className="h-8 text-xs font-mono bg-background"
                />
                <Button
                  variant="ghost"
                  type="button"
                  size="icon"
                  onClick={() => {
                    setShowRefInput(false);
                    setSplitRef('');
                  }}
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Input de Monto + Botón */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="any"
                  value={splitAmountInput}
                  disabled={!isPartialMode}
                  onChange={(e) => setSplitAmountInput(e.target.value)}
                  className={`h-9 text-xs font-mono font-bold pr-8 transition-colors ${
                    !isPartialMode 
                      ? 'bg-muted/50 cursor-not-allowed opacity-90' 
                      : 'bg-background border-primary/50'
                  }`}
                  placeholder="0.00"
                />
                <span className="absolute right-2.5 top-2.5 text-[11px] font-bold text-muted-foreground pointer-events-none">
                  {isSplitBs ? 'Bs' : '$'}
                </span>
              </div>

              {/* Botón sólo visible en Modo Parcial */}
              {isPartialMode && (
                <Button
                  type="button"
                  onClick={handleAddPayment}
                  disabled={!splitMethodId || !splitAmountInput || numericInput <= 0}
                  className="h-9 px-3 shrink-0 gap-1.5 text-xs font-semibold shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Añadir Pago</span>
                </Button>
              )}
            </div>

            {/* Mensaje Informativo o Sección de Excedente */}
            {!isPartialMode ? (
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Se cobrará el 100% de la venta con este método.
              </p>
            ) : (
              <>
                {numericInput < currentPending && (
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Split className="w-3 h-3" /> Restante tras añadir este pago:
                    </span>
                    <strong className="font-mono">
                      {isSplitBs 
                        ? formatBs(Math.max(0, currentPending - numericInput)) 
                        : formatUsd(Math.max(0, currentPending - numericInput))}
                    </strong>
                  </div>
                )}

                {excess > 0 && (
                  <OverpaymentSection
                    excessUsd={excessUsd}
                    excessBs={excessBs}
                    action={overpaymentAction}
                    onChangeAction={setOverpaymentAction}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        /* Estado Totalmente Pagado */
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 justify-center font-medium">
          <BadgeCheck className="h-4.5 w-4.5 shrink-0 text-emerald-500" />
          <span>Monto total cubierto exitosamente</span>
        </div>
      )}

      {/* Lista de Pagos Ya Registrados */}
      {payments.length > 0 && (
        <div className="p-3 rounded-xl border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5" /> Pagos Registrados ({payments.length})
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-semibold">
              Cubierto: {formatUsd(totalUsd - pendingUsd)}
            </span>
          </div>

          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
            {payments.map((p, idx) => {
              const isBs = isBsCurrency(p.currency);
              const methodName = typeof p.method === 'object' && p.method !== null 
                ? p.method.name 
                : String(p.method || 'Método');

              return (
                <div
                  key={`${p.payment_method_id || idx}-${idx}`}
                  className="flex items-center justify-between p-2 rounded-lg border bg-card text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-foreground truncate">{methodName}</span>
                    {p.reference && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground">
                        Ref: {p.reference}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-foreground">
                      {isBs ? formatBs(p.amount_original) : formatUsd(p.amount_original)}
                    </span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removePaymentSplit(idx)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}