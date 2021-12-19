import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { ProductWithStock } from "@presacom/models";
import axios from "axios";
import { RootState } from "../../../store";

export type OutletProductsState = {
  products: ProductWithStock[];
};

const initialState: OutletProductsState = {
  products: []
};

export const getOutletProducts = createAsyncThunk<ProductWithStock[], string>(
  'outletProducts/getOutletProducts',
  async (payload ) => {
    const response = await axios.get<ProductWithStock[]>(`/api/outlet/${payload}/product`);
    return response.data;
  }
);

export const outletProductsSlice = createSlice({
  name: 'outletProducts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOutletProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addCase(getOutletProducts.rejected, (state, action) => {
        state.products = [];
      });
  }
});

const selectOutletProductsState = (state: RootState) => state.outletProducts;
export const selectOutletOrders = createSelector(selectOutletProductsState, (state) => state.products);
