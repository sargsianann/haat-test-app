// lib/api.ts
import axios from "axios";

const BASE_URL = "https://user-new-app-staging.internal.haat.delivery/api";

export const getMarket = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/markets/${id}`);
  return res.data;
};

export const getCategoryItems = async (
  marketId: number,
  categoryId: number
) => {
  const res = await axios.get(
    `${BASE_URL}/markets/${marketId}/categories/${categoryId}`
  );
  return res.data;
};
