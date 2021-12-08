import React from "react";

export type ComponentProps<T = any> = T & {
  children: React.ReactNode
}
