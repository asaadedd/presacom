import { GroupBy, OrderDto } from '@presacom/models';
import { eachMonthOfInterval, eachWeekOfInterval, eachYearOfInterval, isAfter, isBefore, parseISO } from 'date-fns'

export function calculateProfit(incomingOrders: OrderDto[], outgoingOrders: OrderDto[]): number {
  let profit = 0;
  incomingOrders.forEach((order) => {
    profit += order.price;
  });
  outgoingOrders.forEach((order) => {
    profit -= order.price;
  });

  return profit;
}

export function getTimePeriods(startTime: string, endTime: string, groupBy: GroupBy): Date[] {
  const functionMap = {
    [GroupBy.BY_MONTH]: eachMonthOfInterval,
    [GroupBy.BY_WEEK]: eachWeekOfInterval,
    [GroupBy.BY_YEAR]: eachYearOfInterval,
  };
  
  return functionMap[groupBy]({
    start: new Date(startTime),
    end: new Date(endTime)
  });
}

export function getUpperDate(date1: Date, date2: Date): Date {
  return isAfter(date1, date2) ? date1 : date2;
}

export function getLowerDate(date1: Date, date2: Date): Date {
  return isBefore(date1, date2) ? date1 : date2;
}