import { ChangeEvent, useEffect } from "react";
import { FormCheck } from 'react-bootstrap';
import { CustomOrderInformation } from "../../../shared/models/orders";
import DashboardWidget from '../../../shared/presentations/DashboardWidget';
import OrderDetails from "../../../shared/presentations/OrderDetails";
import { useAppDispatch, useAppSelector } from "../../../store";
import { CustomDistributorOrder } from "../models/order";
import { getDistributorProfit } from '../store/distributor';
import { getDistributorOrders, hideDistributorReturnedOrders, returnDistributorOrder, selectDistributorOrders, selectDistributorShowReturnedOrder, showDistributorReturnedOrders } from "../store/distributorOrders";
import { getDistributorProducts } from "../store/distributorProducts";

function DistributorOrdersList() {
  const orders: CustomOrderInformation<CustomDistributorOrder>[] = useAppSelector(selectDistributorOrders);
  const showReturnedOrders = useAppSelector(selectDistributorShowReturnedOrder);
  const dispatch = useAppDispatch();
  const returnOrder = async (orderToReturn: CustomOrderInformation<CustomDistributorOrder>) => {
    await dispatch(returnDistributorOrder(orderToReturn));
    dispatch(getDistributorOrders());
    dispatch(getDistributorProducts());
    dispatch(getDistributorProfit());
  }

  const toggleShowReturnedOrder = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(showDistributorReturnedOrders());
    } else {
      dispatch(hideDistributorReturnedOrders());
    }
  }

  useEffect(() => {
    dispatch(getDistributorOrders());
  }, [dispatch])

  return (
    <DashboardWidget 
      title={<span className="fs-5 fw-bold">Comenzi</span>}
      actions={<FormCheck label="Afiseaza comenzi returnate" onChange={toggleShowReturnedOrder} checked={showReturnedOrders}/>}
    >
      {
        orders.map((ord) => 
          <div className="my-3" key={ord._id} >
            <OrderDetails 
              order={ord}
              additionalInfo={
                <div className="pb-2">
                  <div className="fs-6 text-muted">Distribuitor</div>
                  <div className="fs-6 fw-bold">{ord.outletDetails?.name}</div>
                </div>
              }
              returnOrder={() => returnOrder(ord)}
            />
          </div>
        )
      }
    </DashboardWidget>
    )
}

export default DistributorOrdersList