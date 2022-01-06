import { Col, Container, Form, FormCheck, Row } from "react-bootstrap";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import { ChangeEvent, useEffect, useState } from "react";
import CreateOrder from "../../../shared/presentations/CreateOrder";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getDistributorProducts, selectDistributorProducts } from "../store/distributorProducts";
import { OrderEntry, OrderStatuses, OutletDto } from "@presacom/models";
import TableDisplay from "../../../shared/presentations/TableDisplay";
import DistributorStock from '../containers/DistributorStock';
import DistributorOrdersList from '../containers/DistributorOrdersList';
import DistributorInformation from '../containers/DistributorInformation';
import DistributorProfit from '../containers/DistributorProfit';

function Home() {
  return (
    <Container className="pt-3">
      <Row>
        <Col xs="6" className="mb-3">
          <DistributorInformation />
        </Col>
        <Col xs="6" className="mb-3">
          <DistributorStock />
        </Col>
        <Col xs="12" className="mb-3">
          <DistributorProfit />
        </Col>
        <Col xs="12">
          <DistributorOrdersList />
        </Col>
      </Row>
    </Container>
  )
}

export default Home;
