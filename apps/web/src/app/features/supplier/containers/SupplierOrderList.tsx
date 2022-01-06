import { useAppDispatch, useAppSelector } from "../../../store";
import { getSupplierDetails, returnSupplierOrder, selectSupplierOrders } from "../store/supplier";
import OrderDetails from "../../../shared/presentations/OrderDetails";
import { CustomOrderInformation } from "../../../shared/models/orders";
import { SupplierOrderDto } from "@presacom/models";

function SupplierOrderList() {
  const orders = useAppSelector(selectSupplierOrders);
  const dispatch = useAppDispatch();
  const returnOrder = async (orderToReturn: CustomOrderInformation<SupplierOrderDto>) => {
    await dispatch(returnSupplierOrder(orderToReturn));
    dispatch(getSupplierDetails(orderToReturn.supplierId));
  }

  return (<>
    {
      orders.map((ord) =><div className="my-3" key={ord._id}><OrderDetails order={ord} returnOrder={() => returnOrder(ord)}/></div>)
    }
  </>);
}

export default SupplierOrderList;
