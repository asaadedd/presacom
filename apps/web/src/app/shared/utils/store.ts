import { AnyAction } from "@reduxjs/toolkit";


export function isPendingAction(storeName: string) {
  return (action: AnyAction): boolean => {
    return action.type.endsWith('/pending') && action.type.startsWith(storeName);
  };
}

export function isRejectedAction(storeName: string) {
  return (action: AnyAction): boolean => {
    return action.type.endsWith('/rejected') && action.type.startsWith(storeName);
  };
}
