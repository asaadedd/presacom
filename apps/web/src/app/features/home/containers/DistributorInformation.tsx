import { GroupBy, ProfitData } from '@presacom/models';
import axios from 'axios';
import { startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import DashboardWidget from '../../../shared/presentations/DashboardWidget';
import { useAppDispatch, useAppSelector } from '../../../store';
import { selectOutletsLength } from '../../outlet/store/outlet';
import { getSuppliers, selectSuppliersLength } from '../../supplier/store/supplier';
import { selectDistributorProfit } from '../store/distributor';

function DistributorInformation() {
  const dispatch = useAppDispatch();
  const suppliersLength = useAppSelector(selectSuppliersLength);
  const outletsLength = useAppSelector(selectOutletsLength);
  const allProfit = useAppSelector(selectDistributorProfit);
  const [profit, setProfit] = useState<ProfitData | null>(null);

  const getCurrentMonthProfit = async () => {
    try {
      const endTime = new Date();
      const startTime = startOfMonth(endTime);
      const groupBy = GroupBy.BY_MONTH;
      const profit = await axios.get<ProfitData[]>('/api/distributor/profit', { params: {startTime, endTime, groupBy} });
      if (profit.data?.length) {
        setProfit(profit.data[0]);
      } else {
        setProfit(null);
      }
    } catch (e) {
      setProfit(null);
    }
  }

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch])

  useEffect(() => {
    getCurrentMonthProfit();
  }, [allProfit])

  return (
    <DashboardWidget title={<span className="fs-5 fw-bold">Detalii</span>}>
      <div className="pb-2">
        <span className="fs-6 pe-2 text-muted">Numar de furnizori:</span>
        <span className="fs-6 fw-bold">{suppliersLength}</span>
      </div>
      <div className="pb-2">
        <span className="fs-6 pe-2 text-muted">Numar de puncte de desfacere:</span>
        <span className="fs-6 fw-bold">{outletsLength}</span>
      </div>
      <div className="pb-2">
        <span className="fs-6 pe-2 text-muted">Profit luna curenta:</span>
        <span className="fs-6 fw-bold">{profit?.value}</span>
      </div>
    </DashboardWidget>
  )
}

export default DistributorInformation;