import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Share2, Send, Copy, Check, Phone, Layers } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/interfaces/product.interface';
import { formatBs, formatUsd } from '@/lib/format';
import { useActiveExchangeRate } from '@/features/exchange-rates/hooks/useActiveExchangeRate';

interface ShareCategoryCatalogDialogProps {
    categoryName?: string;  
    categoryId?: string | null;
    disabled?: boolean;
    className?: string;
    fetchCategoryProducts: (categoryId?: string | null) => Promise<any[]>;
}

type GroupingMode = 'none' | 'category' | 'price';

export function ShareCategoryCatalogDialog({
  categoryName = 'General',
  categoryId = null,
  disabled = false,
  className = '',
  fetchCategoryProducts,
}: ShareCategoryCatalogDialogProps) {
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentRate } = useActiveExchangeRate();
  const exchangeRateValue = currentRate?.rate || 1;

  // Estado para el modo de agrupación/ordenamiento
  const [groupBy, setGroupBy] = useState<GroupingMode>(categoryId ? 'none' : 'category');

  // Estados de Texto y Visibilidad (Ocultos por defecto: false)
  const [includeGreeting, setIncludeGreeting] = useState(false);
  const [greeting, setGreeting] = useState(
    `¡Hola! Buen día. Te comparto nuestro catálogo de productos disponibles:`
  );

  const [includeClosing, setIncludeClosing] = useState(false);
  const [closingMessage, setClosingMessage] = useState(
    `_Precios y disponibilidad sujetos a cambio._`
  );

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setIsLoading(true);
      try {
        const data = await fetchCategoryProducts(categoryId);
        setProducts(data || []);
      } catch (error) {
        toast.error('Error al cargar los productos.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const textProducts = (product: Product): string => {
    const name = product.name || 'Producto';
    const price = product.price_usd !== undefined 
      ? `• Precio: ${formatUsd(product.price_usd)}\n  ${formatBs(product.price_usd * exchangeRateValue)}` 
      : '';
    const stock = product.stock !== undefined ? `• Disponible: ${product.stock} un.` : '';
    let text = '';
    text += `*${name}*\n`;
    if (price) text += `   ${price}\n`;
    if (stock) text += `   ${stock}\n`;
    text += `\n`;
    return text;
  };

  const buildPayload = () => {
    let text = '';

    // Solo se incluye el saludo si el check está activo y tiene contenido
    if (includeGreeting && greeting.trim()) {
      text += `${greeting.trim()}\n\n`;
      text += `--------------------------\n`;
    }    

    const activeProducts = products.filter((p) => p.is_active !== false && p.stock > 0);

    if (activeProducts.length === 0) {
      text += `_No hay productos disponibles en este momento._\n`;
    } else {      
      const groupedMap: { [key: string]: any[] } = {};
      
      activeProducts.forEach((product) => {
        const catName = product.category_name || product.category?.name || 'Otras Categorías';
        if (!groupedMap[catName]) {
          groupedMap[catName] = [];
        }
        groupedMap[catName].push(product);
      });

      Object.keys(groupedMap).forEach((cat, index) => {
        if (groupedMap[cat].length > 0) {
          text += `\n*${cat.toUpperCase()}*\n`;
        }
        
        groupedMap[cat].forEach((product) => {
          text += textProducts(product);
        });

        if(groupedMap[cat].length > 0 && index < Object.keys(groupedMap).length - 1){
          text += `--------------------------\n`;
        }

      });
    }

    // Solo se incluye el mensaje de cierre si el check está activo y tiene contenido
    if (includeClosing && closingMessage.trim()) {
      text += `\n${closingMessage.trim()}\n`;
    }

    return text;
  };

  const textPayload = buildPayload();

  const handleCopy = () => {
    navigator.clipboard.writeText(textPayload);
    setCopied(true);
    toast.success('¡Catálogo copiado al portapapeles!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    let cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('0')) {
      cleanPhone = '58' + cleanPhone.substring(1);
    } else if (cleanPhone && !cleanPhone.startsWith('58') && cleanPhone.length === 10) {
      cleanPhone = '58' + cleanPhone;
    }

    const encodedText = encodeURIComponent(textPayload);
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;

    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="outline" size="sm" className={`h-9 flex items-center justify-center border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400 ${className}`}
          
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden lg:block ml-1.5">Compartir Catálogo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Enviar o Copiar Catálogo ({categoryName})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 pt-1 max-h-[80vh] overflow-y-auto pr-1">
          {/* Sección Saludo Inicial */}
          <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <label htmlFor="includeGreetingToggle" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                Incluir mensaje de saludo inicial
              </label>
              <input
                type="checkbox"
                id="includeGreetingToggle"
                checked={includeGreeting}
                onChange={(e) => setIncludeGreeting(e.target.checked)}
                className="h-4 w-4 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
            </div>
            {includeGreeting && (
              <div className="pt-1.5 animate-in fade-in-50 duration-200">
                <Textarea
                  value={greeting}
                  onChange={(e) => setGreeting(e.target.value)}
                  placeholder="Ej: Hola buen día..."
                  rows={2}
                  className="text-xs resize-none min-h-[60px]"
                />
              </div>
            )}
          </div>

          {/* Sección Mensaje de Finalización */}
          <div className="space-y-1.5 bg-muted/30 p-2.5 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <label htmlFor="includeClosingToggle" className="text-xs font-semibold text-foreground cursor-pointer select-none">
                Incluir mensaje de finalización
              </label>
              <input
                type="checkbox"
                id="includeClosingToggle"
                checked={includeClosing}
                onChange={(e) => setIncludeClosing(e.target.checked)}
                className="h-4 w-4 rounded border-input text-emerald-600 focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
              />
            </div>
            {includeClosing && (
              <div className="pt-1.5 animate-in fade-in-50 duration-200">
                <Textarea
                  value={closingMessage}
                  onChange={(e) => setClosingMessage(e.target.value)}
                  placeholder="Ej: _Precios y disponibilidad sujetos a cambio._"
                  rows={2}
                  className="text-xs resize-none min-h-[60px]"
                />
              </div>
            )}
          </div>

          {/* Vista previa del mensaje */}
          <div className="bg-muted/60 p-3 rounded-md text-xs font-mono whitespace-pre-wrap max-h-48 overflow-y-auto border border-border/80">
            {isLoading ? 'Cargando productos...' : textPayload}
          </div>

          {/* Teléfono opcional de destino para envío directo */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Número de destino (Opcional para enviar directo):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Ej: 04121234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 h-9 text-xs font-mono"
                />
              </div>
              <Button
                type="button"
                onClick={handleSendWhatsApp}
                disabled={isLoading}
                className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 gap-1.5 px-4"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </Button>
            </div>
          </div>

          {/* Botón de Copiar independiente */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            disabled={isLoading}
            className="w-full h-8 text-xs gap-1.5 border border-border"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Texto'}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}