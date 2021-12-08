import { EntityState } from "@reduxjs/toolkit/src/entities/models";

export interface AsyncEntityState<T> extends EntityState<T> {
  loading: boolean;
  error?: string;
}
