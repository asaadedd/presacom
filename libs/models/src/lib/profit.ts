export enum GroupBy {
  BY_WEEK = 'BY_WEEK',
  BY_MONTH = 'BY_MONTH',
  BY_YEAR = 'BY_YEAR'
}

export interface ProfitData {
  value: number;
  start: string;
  end: string;
}