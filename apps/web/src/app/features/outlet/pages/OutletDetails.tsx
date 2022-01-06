import { useParams } from "react-router-dom";
import { ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getOutletDetails, getOutletProfit, selectOutletDetails, setOutletId } from "../store/outlet";
import { Col, Container, FormCheck, Row } from "react-bootstrap";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import OutletInfo from "../presentations/OutletInfo";
import TableDisplay from "../../../shared/presentations/TableDisplay";
import CreateOrder from "../../../shared/presentations/CreateOrder";
import { productHeaders } from "../../../shared/models/products";
import { OrderEntry, OrderStatuses } from "@presacom/models";
import { getOutletOrders, hideOutletReturnedOrders, placeOutletOrder, selectOutletShowReturnedOrder, showOutletReturnedOrders } from "../store/outletOrders";
import { getOutletProducts, selectOutletProducts } from "../store/outletProducts";
import OutletOrderList from "../containers/OutletOrderList";
import OutletProfit from '../containers/OutletProfit';

function OutletDetails() {
  const { id } = useParams<'id'>();
  const dispatch  = useAppDispatch();
  const outletDetails = useAppSelector(selectOutletDetails);
  const products = useAppSelector(selectOutletProducts);
  const showReturnedOrders = useAppSelector(selectOutletShowReturnedOrder);

  const toggleShowReturnedOrder = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(showOutletReturnedOrders());
    } else {
      dispatch(hideOutletReturnedOrders());
    }
  }

  const placeOrder = async (entries: OrderEntry[]) => {
    if (id) {
      await dispatch(placeOutletOrder({
        outletId: id,
        status: OrderStatuses.DELIVERED,
        entries,
        price: entries.reduce((price, entry) => {
          price += (entry.unitPrice * entry.quantity) ;

          return price;
        }, 0)
      }));
      dispatch(getOutletOrders(id));
      dispatch(getOutletProducts(id));
      dispatch(getOutletProfit(id));
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(setOutletId(id));
      dispatch(getOutletDetails(id));
      dispatch(getOutletOrders(id));
      dispatch(getOutletProducts(id));
      dispatch(getOutletProfit(id));
    }
  }, [id, dispatch]);

  if (!outletDetails) {
    return null;
  }

  return (
    <Container className="pt-3">
      <Row>
        <Col xs="4" className="pr-2">
          <DashboardWidget title={<span className="fs-4 fw-bold">Detalii</span>} >
            <OutletInfo outlet={outletDetails} />
          </DashboardWidget>
        </Col>
        <Col xs="8" className="pr-2">
          <div className="pb-3">
            <DashboardWidget 
              title={<span className="fs-5 fw-bold">Produse</span>}
              actions={<CreateOrder 
                products={products}
                onSubmit={placeOrder}
              />}
            >
              <TableDisplay useActions={false} useCheckboxes={false} data={products} headers={productHeaders} />
            </DashboardWidget>
          </div>
          <div className="pb-3">
            <OutletProfit />
          </div>
          <div>
            <DashboardWidget 
              title={<span className="fs-5 fw-bold">Comenzi</span>}
              actions={<FormCheck label="Afiseaza comenzi returnate" onChange={toggleShowReturnedOrder} checked={showReturnedOrders}/>}
            >
              <OutletOrderList />
            </DashboardWidget>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default OutletDetails;
