import { endOfMonth, startOfMonth } from 'date-fns';
import { GroupBy, ProfitData } from "@presacom/models";
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store";

export interface ProfitFiltersData {
  startTime?: string,
  endTime?: string,
  groupBy?: GroupBy
}

export type DistributorState = {
  profit: ProfitData[];
  filters: ProfitFiltersData;
};

const initialState: DistributorState = {
  profit: [],
  filters: {
    groupBy: GroupBy.BY_WEEK,
    startTime: startOfMonth(new Date()).toISOString(),
    endTime: endOfMonth(new Date()).toISOString()
  },
};

export const getDistributorProfit = createAsyncThunk<ProfitData[]>(
  'distributor/getDistributorProfit',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state: any  = getState();
      const startTime = selectDistributorStartTime(state);
      const endTime = selectDistributorEndTime(state);
      const groupBy = selectDistributorGroupBy(state);
      if (!startTime || !endTime || !groupBy) {
        return [];
      }
      const response = await axios.get<ProfitData[]>('/api/distributor/profit', { params: {startTime, endTime, groupBy} });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);

export const distributorSlice = createSlice({
  name: 'distributor',
  initialState,
  reducers: {
    setDistributorFilters(state, action: PayloadAction<ProfitFiltersData>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getDistributorProfit.fulfilled, (state, action) => {
      state.profit = action.payload;
    })
    .addCase(getDistributorProfit.rejected, (state) => {
      state.profit = [];
    });
  }
});

export const  { setDistributorFilters } = distributorSlice.actions;

const selectDistributorState = (state: RootState) => state.distributor;
export const selectDistributorStartTime = createSelector(selectDistributorState, (state) => state.filters.startTime);
export const selectDistributorFilters = createSelector(selectDistributorState, (state) => state.filters);
export const selectDistributorEndTime = createSelector(selectDistributorState, (state) => state.filters.endTime);
export const selectDistributorGroupBy = createSelector(selectDistributorState, (state) => state.filters.groupBy);
export const selectDistributorProfit = createSelector(selectDistributorState, (state) => state.profit);