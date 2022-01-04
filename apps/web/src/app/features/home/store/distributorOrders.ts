import { CustomOrderInformation } from './../../../shared/models/orders';
import { OutletDto } from './../../../../../../../libs/models/src/lib/outlet';
import { DistributorOrderDto } from "@presacom/models";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store";
import { uniq } from 'lodash';
import { CustomDistributorOrder } from "../models/order";
import { getOutletDetails, selectOneOutlet } from '../../outlet/store/outlet';
import { formatOrdersInformation } from '../../../shared/utils/order';

export type DistributorOrdersState = {
  orders: CustomOrderInformation<CustomDistributorOrder>[];
};

const initialState: DistributorOrdersState = {
  orders: []
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
      await axios.post(`/api/distributor/order/${order._id}/return`);
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
      const state: any = getState();
      const response = await axios.get<DistributorOrderDto[]>(`/api/distributor/order`);
      const outletsIds = uniq(response.data.map((order: DistributorOrderDto) => order.outletId));
      
      await Promise.all(outletsIds.map(async (outletId) => {
        await dispatch(getOutletDetails(outletId));
      }));

      return formatOrdersInformation<CustomDistributorOrder>(response.data.map((order: DistributorOrderDto) => ({
        ...order,
        outletDetails: selectOneOutlet(state, order.outletId) as OutletDto
      })));
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);

export const distributorOrdersSlice = createSlice({
  name: 'distributorOrders',
  initialState,
  reducers: {},
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

const selectDistributorOrdersState = (state: RootState) => state.distributorOrders;
export const selectDistributorOrders = createSelector(selectDistributorOrdersState, (state) => state.orders);
