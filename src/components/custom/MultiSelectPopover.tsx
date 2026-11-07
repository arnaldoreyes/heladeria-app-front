import * as React from 'react';
import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // O tu utilidad para clases CSS
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export interface Option {
  id: string;
  name: string;
  color?: string; // Útil si es para tags
  depth?: number; // Útil si quieres mostrar categorías en árbol con sangría
}

interface MultiSelectPopoverProps {
  options: Option[];
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

  // Filtrar opciones según la búsqueda
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 py-2 px-3 text-left font-normal"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedValues.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                <span className="text-xs font-semibold mr-1">
                  {selectedValues.length} seleccionados
                </span>
                {/* Opcional: mostrar los primeros chips */}
                {selectedValues.slice(0, 2).map((id) => {
                  const opt = options.find((o) => o.id === id);
                  return (
                    <Badge
                      key={id}
                      variant="secondary"
                      className="text-xs px-1.5 py-0.5"
                      style={opt?.color ? { backgroundColor: `${opt.color}20`, borderColor: opt.color, color: opt.color } : {}}
                    >
                      {opt?.name || id}
                    </Badge>
                  );
                })}
                {selectedValues.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{selectedValues.length - 2} más
                  </span>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-2" align="start">
        {/* Buscador interno */}
        <div className="flex items-center border-b px-3 pb-2 mb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 focus-visible:ring-0 px-0 shadow-none bg-transparent"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Botón Seleccionar Todos / Limpiar */}
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

        {/* Lista de Opciones con Checkboxes */}
        <div className="max-h-60 overflow-y-auto space-y-1 py-1">
          {filteredOptions.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">No se encontraron resultados.</p>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.id);
              const paddingLeft = option.depth ? `${option.depth * 16}px` : '0px';

              return (
                <div
                  key={option.id}
                  onClick={() => handleToggle(option.id)}
                  style={{ paddingLeft }}
                  className={cn(
                    'flex items-center justify-between px-2 py-1.5 rounded-sm text-sm cursor-pointer select-none transition-colors',
                    isSelected ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {/* Indicador de color opcional para tags */}
                    {option.color && (
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="truncate">{option.name}</span>
                  </div>

                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}