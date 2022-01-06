import { CustomOrderInformation } from './../../../shared/models/orders';
import { DistributorOrderDto, OrderStatuses, OutletDto } from "@presacom/models";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store";
import { CustomDistributorOrder } from "../models/order";
import { getOutlets, selectOneOutlet } from '../../outlet/store/outlet';
import { formatOrdersInformation } from '../../../shared/utils/order';

export type DistributorOrdersState = {
  orders: CustomOrderInformation<CustomDistributorOrder>[];
  showReturnedOrders: boolean;
};

const initialState: DistributorOrdersState = {
  orders: [],
  showReturnedOrders: false,
};

export const placeDistributorOrder = createAsyncThunk<void, DistributorOrderDto>(
  'distributorOrders/placeDistributorOrder',
  async (order, { rejectWithValue, dispatch }) => {
    try {
      await axios.post(`/api/distributor/order`, order);
      await dispatch(getDistributorOrders());
      return;
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);

export const returnDistributorOrder = createAsyncThunk<void, DistributorOrderDto>(
  'distributorOrders/returnDistributorOrder',
  async (order, { rejectWithValue, dispatch }) => { 
    try {
      await axios.post(`/api/distributor/order/${order._id}/return`, order);
      await dispatch(getDistributorOrders());
      return;
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);

export const getDistributorOrders = createAsyncThunk<CustomOrderInformation<CustomDistributorOrder>[]>(
  'distributorOrders/getDistributorOrders',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await axios.get<DistributorOrderDto[]>(`/api/distributor/order`);
      
      await dispatch(getOutlets());
      const state: any = getState();

      return formatOrdersInformation<CustomDistributorOrder>(response.data.map((order: DistributorOrderDto) => {
        return {
          ...order,
          outletDetails: selectOneOutlet(state, order.outletId) as OutletDto
        }
      }));
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);

export const distributorOrdersSlice = createSlice({
  name: 'distributorOrders',
  initialState,
  reducers: {
    showDistributorReturnedOrders(state) {
      state.showReturnedOrders = true;
    },
    hideDistributorReturnedOrders(state) {
      state.showReturnedOrders = false;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getDistributorOrders.fulfilled, (state, action) => {
      state.orders = action.payload;
    })
    .addCase(getDistributorOrders.rejected, (state) => {
      state.orders = [];
    });
  }
});

export const  { showDistributorReturnedOrders, hideDistributorReturnedOrders } = distributorOrdersSlice.actions;

const selectDistributorOrdersState = (state: RootState) => state.distributorOrders;
export const selectDistributorOrders = createSelector(selectDistributorOrdersState, (state) => 
  state.orders.filter((ord) => state.showReturnedOrders ? true : ord.status !== OrderStatuses.RETURNED)
);
export const selectDistributorShowReturnedOrder = createSelector(selectDistributorOrdersState, (state) => state.showReturnedOrders);