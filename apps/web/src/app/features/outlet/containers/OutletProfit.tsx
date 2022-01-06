import { useParams } from 'react-router-dom';
import DashboardWidget from '../../../shared/presentations/DashboardWidget';
import ProfitChart from '../../../shared/presentations/ProfitChart';
import ProfitFilters from '../../../shared/presentations/ProfitFilters';
import { useAppDispatch, useAppSelector } from '../../../store';
import { ProfitFiltersData } from '../../home/store/distributor';
import { getOutletProfit, selectOutletFilters, selectOutletProfit, setOutletFilters } from '../store/outlet';

function OutletProfit() {
  const profit = useAppSelector(selectOutletProfit);
  const filters = useAppSelector(selectOutletFilters);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  const onFiltersChange = (filters: ProfitFiltersData) => {
    if (id) {
      dispatch(setOutletFilters(filters));
      dispatch(getOutletProfit(id));
    }
  }

  return (
    <DashboardWidget 
      title={<span className="fs-5 fw-bold">Profit</span>}
      actions={<ProfitFilters filters={filters} onFiltersChange={onFiltersChange} />}
    >
      <ProfitChart profits={profit} filters={filters as any} />
    </DashboardWidget>
    )
}

export default OutletProfit;