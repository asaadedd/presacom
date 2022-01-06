import { CustomOrderInformation } from './../../../shared/models/orders';
import { OrderStatuses, OutletOrderDto } from "@presacom/models";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { resetOutletErrors, setOutletErrors } from "./outlet";
import { RootState } from "../../../store";
import { formatOrdersInformation } from "../../../shared/utils/order";

export type OutletOrdersState = {
  orders: CustomOrderInformation<OutletOrderDto>[];
  showReturnedOrders: boolean;
};

const initialState: OutletOrdersState = {
  orders: [],
  showReturnedOrders: false,
};

export const placeOutletOrder = createAsyncThunk<void, OutletOrderDto>(
  'outletOrders/placeOutletOrder',
  async (order, { rejectWithValue, dispatch }) => {
    try {
      dispatch(resetOutletErrors());
      await axios.post(`/api/outlet/${order.outletId}/order`, order);
      await dispatch(getOutletOrders(order.outletId));
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
      await axios.post(`/api/outlet/${order.outletId}/order/${order._id}/return`, order);
      await dispatch(getOutletOrders(order.outletId));
      return;
    } catch (err: any) {
      dispatch(setOutletErrors(err.message));
      return rejectWithValue(err)
    }
  }
);

export const getOutletOrders = createAsyncThunk<CustomOrderInformation<OutletOrderDto>[], string>(
  'outletOrders/getOutletOrders',
  async (payload, { getState }) => {
    const response = await axios.get<OutletOrderDto[]>(`/api/outlet/${payload}/order`);
    return formatOrdersInformation(response.data);
  }
);

export const outletOrdersSlice = createSlice({
  name: 'outletOrders',
  initialState,
  reducers: {
    showOutletReturnedOrders(state) {
      state.showReturnedOrders = true;
    },
    hideOutletReturnedOrders(state) {
      state.showReturnedOrders = false;
    },
  },
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
export const  { showOutletReturnedOrders, hideOutletReturnedOrders } = outletOrdersSlice.actions;


const selectOutletOrdersState = (state: RootState) => state.outletOrders;
export const selectOutletOrders = createSelector(selectOutletOrdersState, (state) => 
  state.orders.filter((ord) => state.showReturnedOrders ? true : ord.status !== OrderStatuses.RETURNED)
);
export const selectOutletShowReturnedOrder = createSelector(selectOutletOrdersState, (state) => state.showReturnedOrders);
