import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ProductWithStock } from "@presacom/models";
import axios from "axios";
import { RootState } from "../../../store";

export type DistributorProductsState = {
  products: ProductWithStock[];
};

const initialState: DistributorProductsState = {
  products: []
};

export const getDistributorProducts = createAsyncThunk<ProductWithStock[]>(
  'distributorProducts/getDistributorProducts',
  async () => {
    const response = await axios.get<ProductWithStock[]>(`/api/distributor/product`);
    return response.data;
  }
);

export const distributorProductsSlice = createSlice({
  name: 'distributorProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDistributorProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(getDistributorProducts.rejected, (state) => {
        state.products = [];
      });
  }
});

const selectDistributorProductsState = (state: RootState) => state.distributorProducts;
export const selectDistributorProducts = createSelector(selectDistributorProductsState, (state) => state.products);
