import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductWithStock, SupplierDto, SupplierOrderDto } from "@presacom/models";
import axios from "axios";
import { RootState } from "../../../store";
import { SupplierInformation } from "../models/suppliers";
import { isPendingAction, isRejectedAction } from "../../../shared/utils/store";
import { toast } from "react-toastify";
import { AsyncEntityState } from "../../../shared/models/entity";
import { formatOrdersInformation } from "../../../shared/utils/order";

export type SupplierState = {
  suppliers: AsyncEntityState<SupplierInformation>;
  supplierId: string | null;
}

const suppliersAdapter = createEntityAdapter<SupplierInformation>({
  selectId: (a) => a._id || a.cui,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
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

export const getSupplierDetails = createAsyncThunk<SupplierInformation, string>(
  'supplier/getSupplierDetails',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.get<SupplierDto>(`/api/supplier/${payload}`);
      const products = await axios.get<ProductWithStock[]>(`/api/supplier/${payload}/product`);
      const orders = await axios.get<SupplierOrderDto[]>('/api/supplier/order');
      return {
        ...response.data,
        products: products.data,
        orders: formatOrdersInformation(orders.data, products.data)
      };
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

export const  { setSupplierId, resetSupplierId } = supplierSlice.actions;

const selectState = (state: RootState) => state.supplier;
const selectSuppliersAdapter = createSelector(selectState, (state) => state.suppliers);
const selectSupplierId = createSelector(selectState, (state) => state.supplierId);
const selectSupplierEntries = createSelector(selectSuppliersAdapter, (state) => state.entities);
const suppliersSelector = suppliersAdapter.getSelectors(selectSuppliersAdapter);

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
// export const selectSuppliersLoading = createSelector(selectState, (state) => state.suppliersLoading);
// export const selectSuppliersError = createSelector(selectState, (state) => state.suppliersError);
// export const selectSupplierProducts = createSelector(selectState, (state) => state.products);
// export const selectSuppliersProductsLoading = createSelector(selectState, (state) => state.productsLoading);
// export const selectSuppliersProductsError = createSelector(selectState, (state) => state.productsError);
