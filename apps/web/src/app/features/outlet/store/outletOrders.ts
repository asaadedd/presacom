import { OutletOrderDto } from "@presacom/models";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetOutletErrors, setOutletErrors, startOutletLoading, stopOutletLoading } from "./outlet";
import { RootState } from "../../../store";

export type OutletOrdersState = {
  orders: OutletOrderDto[];
};

const initialState: OutletOrdersState = {
  orders: []
};

export const placeOutletOrder = createAsyncThunk<void, OutletOrderDto>(
  'outletOrders/placeOutletOrder',
  async (order, { rejectWithValue, dispatch }) => {
    try {
      dispatch(resetOutletErrors());
      dispatch(startOutletLoading());
      await axios.post(`/api/outlet/${order.outletId}/order`, order);
      await dispatch(getOutletOrders(order.outletId));
      dispatch(stopOutletLoading());
      return;
    } catch (err: any) {
      dispatch(setOutletErrors(err.message));
      return rejectWithValue(err)
    }
  }
);

export const returnOutletOrder = createAsyncThunk<void, OutletOrderDto>(
  'outletOrders/returnOutletOrder',
  async (order, { rejectWithValue, dispatch }) => {
    try {
      dispatch(resetOutletErrors());
      dispatch(startOutletLoading());
      await axios.post(`/api/outlet/${order.outletId}/order/${order._id}/return`);
      await dispatch(getOutletOrders(order.outletId));
      dispatch(stopOutletLoading());
      return;
    } catch (err: any) {
      dispatch(setOutletErrors(err.message));
      return rejectWithValue(err)
    }
  }
);

export const getOutletOrders = createAsyncThunk<OutletOrderDto[], string>(
  'outletOrders/getOutletOrders',
  async (payload ) => {
    const response = await axios.get<OutletOrderDto[]>(`/api/outlet/${payload}/order`);
    return response.data;
  }
);

export const outletOrdersSlice = createSlice({
  name: 'outletOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOutletOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(getOutletOrders.rejected, (state, action) => {
        state.orders = [];
      });
  }
});

const selectOutletOrdersState = (state: RootState) => state.outletOrders;
export const selectOutletOrders = createSelector(selectOutletOrdersState, (state) => state.orders);
