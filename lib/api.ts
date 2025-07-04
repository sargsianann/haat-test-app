import { BASE_URL } from "@/constants";
import { Product } from "@/types";
import axios from "axios";

export type Subcategory = {
  id: number;
  name: Record<string, string>;
  products: Product[];
};

export type CategoryResponse = {
  id: number;
  name: Record<string, string>;
  icon?: { serverImage: string };
  marketSubcategories: Subcategory[];
};

export const getMarket = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/markets/${id}`);

  return res.data;
};
export async function getCategoryDetail(
  categoryId: string,
  lang: string,
  pageSize: number
) {
  const res = await fetch(`${BASE_URL}/markets/4532/categories/${categoryId}`);
  const json: CategoryResponse = await res.json();

  const sections = (json.marketSubcategories ?? []).map((sub) => {
    const allProducts = sub.products ?? [];
    return {
      id: sub.id,
      title: sub.name?.[lang] ?? "",
      allProducts,
      data: allProducts.slice(0, pageSize),
      page: 1,
      hasMore: allProducts.length > pageSize,
      loadingMore: false,
    };
  });

  return {
    categoryData: json,
    sections,
  };
}
