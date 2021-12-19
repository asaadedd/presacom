import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductWithStock, SupplierDto, SupplierOrderDto } from "@presacom/models";
import axios from "axios";
import { RootState } from "../../../store";
import { SupplierInformation } from "../models/suppliers";
import { isPendingAction, isRejectedAction } from "../../../shared/utils/store";
import { toast } from "react-toastify";
import { AsyncEntityState } from "../../../shared/models/entity";
import { formatOrdersInformation } from "../../../shared/utils/order";
import { CustomOrderInformation } from "../../../shared/models/orders";

export type SupplierState = {
  suppliers: AsyncEntityState<SupplierInformation>;
  supplierId: string | null;
}

const suppliersAdapter = createEntityAdapter<SupplierInformation>({
  selectId: (a) => a._id || a.cui,
  sortComparer: (a, b) => a?.name?.localeCompare(b?.name),
});

const initialState: SupplierState = {
  suppliers: suppliersAdapter.getInitialState({ loading: false }),
  supplierId: null
}

export const getSuppliers = createAsyncThunk<SupplierDto[]>(
  'supplier/getSuppliers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get<SupplierDto[]>('/api/supplier');
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const addSupplier = createAsyncThunk<SupplierDto, SupplierDto>(
  'supplier/addSuppliers',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post<SupplierDto>('/api/supplier', payload);
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const deleteSupplier = createAsyncThunk<void, string>(
  'supplier/deleteSupplier',
  async (payload, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/supplier/${payload}`);
      return;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const importSuppliers = createAsyncThunk(
  'supplier/importSuppliers',
  async (payload: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', payload)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const response = await axios.post('/api/supplier/import', formData, config);
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const importProducts = createAsyncThunk<void, {file: File, supplierId: string}>(
  'supplier/importProducts',
  async ({file, supplierId}, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file)
      const config = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      await axios.post(`/api/supplier/${supplierId}/product/import`, formData, config);
      return;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const getSupplierDetails = createAsyncThunk<SupplierInformation, string>(
  'supplier/getSupplierDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get<SupplierDto>(`/api/supplier/${payload}`);
      const products = await axios.get<ProductWithStock[]>(`/api/supplier/${payload}/product`);
      const orders = await axios.get<SupplierOrderDto[]>(`/api/supplier/${payload}/order`);

      return {
        ...response.data,
        products: products.data,
        orders: formatOrdersInformation(orders.data)
      };
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const placeSupplierOrder = createAsyncThunk<void, SupplierOrderDto>(
  'supplier/placeSupplierOrder',
  async (order, { rejectWithValue }) => {
    try {
      await axios.post(`/api/supplier/${order.supplierId}/order`, order);
      return;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const returnSupplierOrder = createAsyncThunk<void, SupplierOrderDto>(
  'supplier/returnSupplierOrder',
  async (order, { rejectWithValue }) => {
    try {
      await axios.post(`/api/supplier/${order.supplierId}/order/${order._id}/return`);
      return;
    } catch (err) {
      return rejectWithValue(err)
    }
  }
);

export const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    setSupplierId(state, action: PayloadAction<string>) {
      state.supplierId = action.payload;
    },
    resetSupplierId(state) {
      state.supplierId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSuppliers.fulfilled, (state, action) => {
        suppliersAdapter.setAll(state.suppliers, action.payload);
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        suppliersAdapter.addOne(state.suppliers, action.payload);
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(getSupplierDetails.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
        if (!state.suppliers.ids.includes(action.meta.arg)) {
          suppliersAdapter.addOne(state.suppliers, action.payload);
        } else {
          suppliersAdapter.updateOne(state.suppliers, {
            id: action.meta.arg,
            changes: {
              ...action.payload
            }
          });
        }
      })
      .addCase(importSuppliers.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(importProducts.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(placeSupplierOrder.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addCase(returnSupplierOrder.fulfilled, (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = undefined;
      })
      .addMatcher(isPendingAction('supplier'), (state, action) => {
        state.suppliers.loading = true;
        state.suppliers.error = undefined;
      })
      .addMatcher(isRejectedAction('supplier'), (state, action) => {
        state.suppliers.loading = false;
        state.suppliers.error = action.error?.message;
        toast.error(action.error?.message);
      });
  },
});


export const selectSupplierState = (state: RootState) => state.supplier;
const selectSuppliersAdapter = createSelector(selectSupplierState, (state) => state.suppliers);
const selectSupplierId = createSelector(selectSupplierState, (state) => state.supplierId);
const selectSupplierEntries = createSelector(selectSuppliersAdapter, (state) => state.entities);
const suppliersSelector = suppliersAdapter.getSelectors(selectSuppliersAdapter);

export const  { setSupplierId, resetSupplierId } = supplierSlice.actions;
export const selectSuppliers = suppliersSelector.selectAll;
export const selectSuppliersLoading = createSelector(selectSuppliersAdapter, (state) => state.loading);
export const selectSuppliersError = createSelector(selectSuppliersAdapter, (state) => state.error);
export const selectSupplierDetails = createSelector([selectSupplierId, selectSupplierEntries],
  (supplierId, entities): SupplierInformation | null | undefined => {
    if (supplierId) {
      return entities[supplierId] || null;
    } else {
       return null;
    }
  }
);
export const selectSupplierProducts = createSelector([selectSupplierId, selectSupplierEntries],
  (supplierId, entities): ProductWithStock[] => {
    if (supplierId && entities[supplierId]) {
      return entities[supplierId]?.products || [];
    } else {
      return [];
    }
  }
);
export const selectSupplierOrders = createSelector([selectSupplierId, selectSupplierEntries],
  (supplierId, entities): CustomOrderInformation<SupplierOrderDto>[] => {
    if (supplierId && entities[supplierId]) {
      return entities[supplierId]?.orders || [];
    } else {
      return [];
    }
  }
);
