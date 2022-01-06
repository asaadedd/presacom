import DashboardWidget from '../../../shared/presentations/DashboardWidget';
import ProfitChart from '../../../shared/presentations/ProfitChart';
import ProfitFilters from '../../../shared/presentations/ProfitFilters';
import { useAppDispatch, useAppSelector } from '../../../store';
import { getDistributorProfit, ProfitFiltersData, selectDistributorFilters, selectDistributorProfit, setDistributorFilters } from '../store/distributor';

function DistributorProfit() {
  const profit = useAppSelector(selectDistributorProfit);
  const filters = useAppSelector(selectDistributorFilters);
  const dispatch = useAppDispatch();

  const onFiltersChange = (filters: ProfitFiltersData) => {
    dispatch(setDistributorFilters(filters));
    dispatch(getDistributorProfit());
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

export default DistributorProfit;