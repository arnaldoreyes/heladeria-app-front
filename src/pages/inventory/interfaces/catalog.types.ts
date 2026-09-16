import type { useRestockProducts } from "../hooks/useRestockProducts";
import type { CategoryApiResponse } from "./category.response";
import type { ProductApiResponse } from "./product.response";


export interface RestockProductCatalogProps {
  categories: CategoryApiResponse[];
  isLoading: boolean;
  onSelectProduct: (product: ProductApiResponse) => void;
  onAddNewProduct?: () => void;
  catalog: ReturnType<typeof useRestockProducts>;
}