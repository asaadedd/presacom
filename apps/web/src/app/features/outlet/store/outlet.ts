import { endOfMonth, startOfMonth } from 'date-fns';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncEntityState } from "../../../shared/models/entity";
import { GroupBy, OutletDto, ProfitData } from "@presacom/models";
import axios from "axios";
import { isPendingAction, isRejectedAction } from "../../../shared/utils/store";
import { toast } from "react-toastify";
import { RootState } from "../../../store";
import { ProfitFiltersData } from '../../home/store/distributor';

export type OutletState = {
  outlets: AsyncEntityState<OutletDto>;
  outletId: string | null;
  profit: ProfitData[];
  filters: ProfitFiltersData;
}

const outletsAdapter = createEntityAdapter<OutletDto>({
  selectId: (a) => a._id || a.name,
  sortComparer: (a, b) => a?.name?.localeCompare(b?.name),
});

const initialState: OutletState = {
  outlets: outletsAdapter.getInitialState({ loading: false }),
  outletId: null,
  profit: [],
  filters: {
    groupBy: GroupBy.BY_WEEK,
    startTime: startOfMonth(new Date()).toISOString(),
    endTime: endOfMonth(new Date()).toISOString()
  },
}

export const getOutlets = createAsyncThunk<OutletDto[]>(
  'outlet/getOutlets',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get<OutletDto[]>('/api/outlet');
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const addOutlet = createAsyncThunk<OutletDto, OutletDto>(
  'outlet/addSuppliers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<OutletDto>('/api/outlet', payload);
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const deleteOutlet = createAsyncThunk<void, string>(
  'outlet/deleteOutlet',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`/api/outlet/${payload}`);
      await dispatch(getOutlets());
      return;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const importOutlets = createAsyncThunk(
  'outlet/importOutlets',
  async (payload: File, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append('file', payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const response = await axios.post('/api/outlet/import', formData, config);
      await dispatch(getOutlets());
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const getOutletDetails = createAsyncThunk<OutletDto, string>(
  'outlet/getOutletDetails',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get<OutletDto>(`/api/outlet/${payload}`);

      return response.data;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const getOutletProfit = createAsyncThunk<ProfitData[], string>(
  'outlet/getOutletProfit',
  async (payload, { rejectWithValue, getState }) => {
    try {
      const state: any  = getState();
      const startTime = selectOutletStartTime(state);
      const endTime = selectOutletEndTime(state);
      const groupBy = selectOutletGroupBy(state);
      if (!startTime || !endTime || !groupBy) {
        return [];
      }
      const response = await axios.get<ProfitData[]>(`/api/outlet/${payload}/profit`, { params: {startTime, endTime, groupBy} });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err)
    }
  }
);


export const outletSlice = createSlice({
  name: 'outlet',
  initialState,
  reducers: {
    setOutletId(state, action: PayloadAction<string>) {
      state.outletId = action.payload;
    },
    setOutletErrors(state, action: PayloadAction<string>) {
      state.outlets.error = action.payload;
    },
    resetOutletErrors(state) {
      state.outlets.error = undefined;
    },
    setOutletFilters(state, action: PayloadAction<ProfitFiltersData>) {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOutlets.fulfilled, (state, action) => {
        outletsAdapter.setAll(state.outlets, action.payload);
        state.outlets.loading = false;
        state.outlets.error = undefined;
      })
      .addCase(addOutlet.fulfilled, (state, action) => {
        outletsAdapter.addOne(state.outlets, action.payload);
        state.outlets.loading = false;
        state.outlets.error = undefined;
      })
      .addCase(deleteOutlet.fulfilled, (state, action) => {
        state.outlets.loading = false;
        state.outlets.error = undefined;
      })
      .addCase(importOutlets.fulfilled, (state, action) => {
        state.outlets.loading = false;
        state.outlets.error = undefined;
      })
      .addCase(getOutletDetails.fulfilled, (state, action) => {
        state.outlets.loading = false;
        state.outlets.error = undefined;
        if (!state.outlets.ids.includes(action.meta.arg)) {
          outletsAdapter.addOne(state.outlets, action.payload);
        } else {
          outletsAdapter.updateOne(state.outlets, {
            id: action.meta.arg,
            changes: {
              ...action.payload
            }
          });
        }
      })
      .addCase(getOutletProfit.fulfilled, (state, action) => {
        state.profit = action.payload;
      })
      .addMatcher(isPendingAction('outlet'), (state, action) => {
        state.outlets.loading = true;
        state.outlets.error = undefined;
      })
      .addMatcher(isRejectedAction('outlet'), (state, action) => {
        state.outlets.loading = false;
        state.outlets.error = action.error?.message;
        toast.error(action.error?.message);
      });
  },
});

const selectOutletState = (state: RootState) => state.outlet;
const selectOutletsAdapter = createSelector(selectOutletState, (state) => state.outlets);
const selectOutletEntries = createSelector(selectOutletsAdapter, (state) => state.entities);
const outletsSelector = outletsAdapter.getSelectors(selectOutletsAdapter);

export const  { setOutletId, setOutletErrors, resetOutletErrors, setOutletFilters } = outletSlice.actions;
export const selectOutletStartTime = createSelector(selectOutletState, (state) => state.filters.startTime);
export const selectOutletFilters = createSelector(selectOutletState, (state) => state.filters);
export const selectOutletEndTime = createSelector(selectOutletState, (state) => state.filters.endTime);
export const selectOutletGroupBy = createSelector(selectOutletState, (state) => state.filters.groupBy);
export const selectOutletProfit = createSelector(selectOutletState, (state) => state.profit);
export const selectOutlets = outletsSelector.selectAll;
export const selectOneOutlet = outletsSelector.selectById;
export const selectOutletsLength = createSelector(outletsSelector.selectAll, (outlets) => outlets.length);
export const selectOutletId = createSelector(selectOutletState, (state) => state.outletId);
export const selectOutletsError = createSelector(selectOutletsAdapter, (state) => state.error);
export const selectOutletDetails = createSelector([selectOutletId, selectOutletEntries],
  (outletId, entities): OutletDto | null | undefined => {
    if (outletId) {
      return entities[outletId] || null;
    } else {
      return null;
    }
  }
);
