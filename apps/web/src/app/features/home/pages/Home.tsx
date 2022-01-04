import { Col, Container, Row } from "react-bootstrap";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import ProfitChart from "../../../shared/presentations/ProfitChart";
import TimeboxSelector, { SelectedTime } from "../../../shared/presentations/TimeboxSelector";
import { useEffect, useState } from "react";
import CreateOrder from "../../../shared/presentations/CreateOrder";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getDistributorProducts, selectDistributorProducts } from "../store/distributorProducts";
import { OrderEntry } from "@presacom/models";
import TableDisplay from "../../../shared/presentations/TableDisplay";
import { productHeaders } from "../../../shared/models/products";
import { getDistributorOrders, selectDistributorOrders } from "../store/distributorOrders";

function Home() {
  const [selectedTime, setSelectedTime] = useState<SelectedTime | undefined>();
  const products = useAppSelector(selectDistributorProducts);
  const orders = useAppSelector(selectDistributorOrders);
  const dispatch = useAppDispatch();

  const onOrderSubmit = (entries: OrderEntry[]) => {
    console.log(1, entries);
  }

  useEffect(() => {
    dispatch(getDistributorProducts());
    dispatch(getDistributorOrders());
  }, [dispatch])

  return (
    <Container className="pt-3">
      <Row>
        <Col xs="6">
          <DashboardWidget title="Stock"
                           actions={<CreateOrder products={products} onSubmit={onOrderSubmit} />}>
            <TableDisplay useCheckboxes={false} data={products} headers={productHeaders} />
          </DashboardWidget>
        </Col>
        <Col xs="6">
          <DashboardWidget title="Comenzi"
                           actions={<TimeboxSelector selectedTime={selectedTime} onTimeSelect={setSelectedTime}/>}
          >
            <TableDisplay useCheckboxes={false} data={orders} headers={productHeaders} />
          </DashboardWidget>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;
