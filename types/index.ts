export type Category = {
  marketSubcategories: never[];
  id: number;
  name: Record<string, string>;
  serverImageUrl: string;
  smallImageUrl?: string;
};

export type Product = {
  id: number;
  name: Record<string, string>;
};

export type SectionType = {
  id: number;
  title: string;
  allProducts: Product[];
  data: Product[];
  page: number;
  hasMore: boolean;
  loadingMore?: boolean;
};
