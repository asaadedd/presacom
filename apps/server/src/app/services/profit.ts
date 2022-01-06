import { GroupBy, OrderDto, OrderStatuses, ProfitData } from '@presacom/models';
import { Model } from 'mongoose';
import { calculateProfit, getTimePeriods, getUpperDate } from '../utils/profit';

interface Query {
  groupBy: GroupBy,
  startTime: string,
  endTime: string
}

export async function getProfit(incomingOrderModel: Model<OrderDto>, outgoingOrderModel: Model<OrderDto>, query: Query, additionalQuery: any): Promise<ProfitData[]> {
  const groupBy = query.groupBy as GroupBy;
  const datesInPeriod = getTimePeriods(query.startTime, query.endTime, groupBy);

  return Promise.all(
    datesInPeriod.map(async (start, index) => {
      const startTime = getUpperDate(start, new Date(query.startTime));
      const endTime = datesInPeriod[index + 1] ? datesInPeriod[index + 1] : new Date(query.endTime);
      const incomingOrders = await incomingOrderModel.find({
        createdAt: {
          $gte: startTime.toString(),
          $lt: endTime.toString()
        },
        status: OrderStatuses.DELIVERED,
        ...additionalQuery
      }).exec();

      const outgoingOrders = await outgoingOrderModel.find({
        createdAt: {
          $gte: startTime.toString(),
          $lt: endTime.toString()
        },
        status: OrderStatuses.DELIVERED,
        ...additionalQuery
      }).exec();
      
      return {
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        value: calculateProfit(incomingOrders, outgoingOrders),
      };
    })
  )
}