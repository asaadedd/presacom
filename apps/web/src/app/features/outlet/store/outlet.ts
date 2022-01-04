import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AsyncEntityState } from "../../../shared/models/entity";
import { OutletDto } from "@presacom/models";
import axios from "axios";
import { isPendingAction, isRejectedAction } from "../../../shared/utils/store";
import { toast } from "react-toastify";
import { RootState } from "../../../store";
import { getOutletOrders } from "./outletOrders";

export type OutletState = {
  outlets: AsyncEntityState<OutletDto>;
  outletId: string | null;
}

const outletsAdapter = createEntityAdapter<OutletDto>({
  selectId: (a) => a._id || a.name,
  sortComparer: (a, b) => a?.name?.localeCompare(b?.name),
});

const initialState: OutletState = {
  outlets: outletsAdapter.getInitialState({ loading: false }),
  outletId: null
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
      await dispatch(getOutletOrders(payload));

      return response.data;
    } catch (err) {
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
    startOutletLoading(state) {
      state.outlets.loading = true;
    },
    stopOutletLoading(state) {
      state.outlets.loading = false;
    },
    setOutletErrors(state, action: PayloadAction<string>) {
      state.outlets.error = action.payload;
    },
    resetOutletErrors(state) {
      state.outlets.error = undefined;
    }
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

export const  { setOutletId, startOutletLoading, stopOutletLoading, setOutletErrors, resetOutletErrors } = outletSlice.actions;
export const selectOutlets = outletsSelector.selectAll;
export const selectOneOutlet = outletsSelector.selectById;
export const selectOutletId = createSelector(selectOutletState, (state) => state.outletId);
export const selectOutletsLoading = createSelector(selectOutletsAdapter, (state) => state.loading);
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
