import { ChevronDown, ChevronUp, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatUsd } from '@/lib/format';
import { Button } from '@/components/ui/button';

type DiscountType = 'percentage' | 'fixed';

interface DiscountSectionProps {
  showDiscount: boolean;
  discountType: DiscountType;
  discountValueInput: string;
  discountUsd: number;
  onToggleShow: () => void;
  onChangeType: (type: DiscountType) => void;
  onChangeValue: (val: string) => void;
}

export function DiscountSection({
  showDiscount,
  discountType,
  discountValueInput,
  discountUsd,
  onToggleShow,
  onChangeType,
  onChangeValue,
}: DiscountSectionProps) {
  return (
    <div className="border rounded-lg p-2 bg-muted/20">
      <Button
        variant='ghost'
        type="button"
        className="w-full flex justify-between items-center p-0 h-auto hover:bg-transparent text-xs font-semibold text-muted-foreground"
        onClick={onToggleShow}
      >
        <span className="flex items-center gap-1">
          <Tag className="h-3.5 w-3.5" /> Aplicar Descuento Global
        </span>
        {discountUsd > 0 ? (
          <span className="text-emerald-600 font-mono font-bold">
            -{formatUsd(discountUsd)}
          </span>
        ) : (
          <span className="text-[10px] text-primary underline">
            {showDiscount ?  <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </span>
        )}
      </Button>

      {(showDiscount || discountUsd > 0) && (
        <div className="flex gap-2 mt-2 pt-2 border-t">
          <div className="flex bg-muted rounded-md">
            <Button
              variant={discountType === 'percentage' ? 'default' : 'ghost'}
              type="button"
              className={'rounded-0 border'}
              onClick={() => onChangeType('percentage')}
            >
              %
            </Button>
            <Button
              variant={discountType === 'fixed' ?  'default' : 'ghost'}
              type="button"
              className={'rounded-0 border'}
              onClick={() => onChangeType('fixed')}
            >
              $
            </Button>
          </div>
          <Input
            type="number"
            placeholder={discountType === 'percentage' ? 'Ej. 10%' : 'Ej. 5$'}
            value={discountValueInput}
            onChange={(e) => onChangeValue(e.target.value)}
            className=""
          />
        </div>
      )}
    </div>
  );
}