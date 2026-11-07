import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface MultiSelectOption {
  id: string;
  name: string;
  color?: string;
  depth?: number;
}

interface MultiSelectPopoverProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  searchPlaceholder?: string;
}

export function MultiSelectPopover({
  options,
  selectedValues,
  onChange,
  placeholder,
  searchPlaceholder = 'Buscar...',
}: MultiSelectPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggle = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((item) => item !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map((opt) => opt.id));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger  className="w-full flex items-center justify-between h-auto min-h-10 py-1.5 px-3 text-left font-normal">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className=" justify-between h-auto min-h-10 py-1.5 px-3 text-left font-normal"
        >
          {/* Contenedor flexible con min-w-0 para permitir truncado correcto */}
          <div className="flex flex-wrap gap-1 items-center min-w-0 flex-1 pr-2">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground truncate text-sm">{placeholder}</span>
            ) : (
              selectedValues.map((id) => {
                const opt = options.find((o) => o.id === id);
                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="text-xs px-1.5 py-0.5 max-w-[150px] truncate"
                    style={
                      opt?.color
                        ? { backgroundColor: `${opt.color}20`, borderColor: opt.color, color: opt.color }
                        : {}
                    }
                  >
                    <span className="truncate">{opt?.name || id}</span>
                  </Badge>
                );
              })
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      {/* Popover adaptativo al ancho del trigger o pantalla */}
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-[260px] p-2" align="start">
        <div className="flex items-center border-b px-3 pb-2 mb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent text-sm"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex justify-between items-center px-2 pb-2 text-xs text-muted-foreground border-b mb-1">
          <span>{filteredOptions.length} disponibles</span>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-primary hover:underline font-medium"
          >
            {selectedValues.length === options.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {filteredOptions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No se encontraron resultados.</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              const paddingLeft = option.depth ? `${option.depth * 16 + 8}px` : '8px';

              return (
                <div
                  key={option.id}
                  onClick={() => handleToggle(option.id)}
                  style={{ paddingLeft }}
                  className={cn(
                    'flex items-center justify-between pr-2 py-1.5 rounded-sm text-sm cursor-pointer select-none transition-colors',
                    isSelected ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {option.color && (
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: option.color }} />
                    )}
                    <span className="truncate">
                      {option.depth ? `└─ ${option.name}` : option.name}
                    </span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}