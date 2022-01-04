import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { supplierSlice } from "./features/supplier/store/supplier";
import { outletSlice } from "./features/outlet/store/outlet";
import { outletOrdersSlice } from "./features/outlet/store/outletOrders";
import { outletProductsSlice } from "./features/outlet/store/outletProducts";
import { distributorProductsSlice } from "./features/home/store/distributorProducts";
import { distributorOrdersSlice } from "./features/home/store/distributorOrders";

export const store = configureStore({
  reducer: {
    supplier: supplierSlice.reducer,
    outlet: outletSlice.reducer,
    outletOrders: outletOrdersSlice.reducer,
    outletProducts: outletProductsSlice.reducer,
    distributorProducts: distributorProductsSlice.reducer,
    distributorOrders: distributorOrdersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
