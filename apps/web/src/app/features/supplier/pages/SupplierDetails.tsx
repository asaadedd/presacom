import LoadingOverlay from "../../../shared/presentation/LoadingOverlay";
import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getSupplierDetails,
  resetSupplierId,
  selectSupplierDetails,
  selectSuppliersLoading,
  setSupplierId
} from "../store/supplier";
import { useParams } from "react-router-dom";
import DashboardWidget from "../../../shared/presentation/DashboardWidget";
import SupplierInfo from "../presentation/SupplierInfo";

function SupplierDetails() {
  const supplierLoading = useAppSelector(selectSuppliersLoading);
  const supplierDetails = useAppSelector(selectSupplierDetails);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    if (id) {
      dispatch(setSupplierId(id));
      dispatch(getSupplierDetails(id));
    } else {
      dispatch(resetSupplierId());
    }
  }, [dispatch, id]);

  if (!supplierDetails) {
    return null;
  }

  return (
    <LoadingOverlay
      loading={supplierLoading}
      text='Se incarca detailii despre furnizor...'
    >
      <Container className="pt-3">
        <Row>
          <Col xs="4" className="pr-2">
            <DashboardWidget title={<span className="fs-4 fw-bold">Detalii</span>} >
              <SupplierInfo supplier={supplierDetails} />
            </DashboardWidget>
          </Col>
          <Col xs="8" className="pr-2">
            <Row className="pb-3">
              <DashboardWidget title={<span className="fs-5 fw-bold">Comenzi</span>}>
              </DashboardWidget>
            </Row>
            <Row>
              <DashboardWidget title={<span className="fs-5 fw-bold">Produse</span>}>
              </DashboardWidget>
            </Row>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
}

export default SupplierDetails;
