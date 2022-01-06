import { useAppDispatch, useAppSelector } from "../../../store";
import OrderDetails from "../../../shared/presentations/OrderDetails";
import { CustomOrderInformation } from "../../../shared/models/orders";
import { OutletOrderDto } from "@presacom/models";
import { getOutletOrders, returnOutletOrder, selectOutletOrders } from "../store/outletOrders";
import { getOutletProducts } from "../store/outletProducts";
import { useParams } from "react-router-dom";

function OutletOrderList() {
  const orders = useAppSelector(selectOutletOrders);
  const { id } = useParams<'id'>();
  const dispatch = useAppDispatch();
  const returnOrder = async (orderToReturn: CustomOrderInformation<OutletOrderDto>) => {
    if (id) {
      await dispatch(returnOutletOrder(orderToReturn));
      dispatch(getOutletOrders(id));
      dispatch(getOutletProducts(id));
    }
  }

  return (<>
    {
      orders.map((ord) =>
        <div className="my-3" key={ord._id} >
          <OrderDetails order={ord} returnOrder={() => returnOrder(ord)}/>
        </div>
      )
    }
  </>);
}

export default OutletOrderList;
