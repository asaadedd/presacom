import { useParams } from "react-router-dom";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getOutletDetails, selectOutletsLoading, setOutletId } from "../store/outlet";
import LoadingOverlay from "../../../shared/presentations/LoadingOverlay";
import { Button, Col, Container, Row } from "react-bootstrap";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import FileSelector from "../../../shared/presentations/FileSelector";
import ProductsList from "../../supplier/containers/ProductsList";
import SupplierOrderList from "../../supplier/containers/SupplierOrderList";
import OutletInfo from "../presentations/OutletInfo";

function OutletDetails() {
  const { id } = useParams<'id'>();
  const dispatch  = useAppDispatch();
  const outletLoading = useAppSelector(selectOutletsLoading);

  useEffect(() => {
    if (id) {
      dispatch(setOutletId(id));
      dispatch(getOutletDetails(id));
    }
  }, [id, dispatch]);

  return (
    <LoadingOverlay
      loading={outletLoading}
      text='Se incarca detailii despre distribuitor...'
    >
      <Container className="pt-3">
        <Row>
          <Col xs="4" className="pr-2">
            <DashboardWidget title={<span className="fs-4 fw-bold">Detalii</span>} >
              <OutletInfo outlet={}/>
            </DashboardWidget>
          </Col>
          <Col xs="8" className="pr-2">
            <Row className="pb-3">
              <DashboardWidget
                title={<span className="fs-5 fw-bold">Produse</span>}
                actions={<>
                  <FileSelector
                    title="Importa produse"
                    extension=".xlsx"
                    onFileLoaded={onProductsImport}
                  />
                  <Button className="ms-2" variant="primary" size="sm" onClick={() => placeOrder()}>Plaseaza comanda</Button>
                </>
                }
              >
                <ProductsList onEntryChanged={setEntries} />
              </DashboardWidget>
            </Row>
            <Row>
              <DashboardWidget title={<span className="fs-5 fw-bold">Comenzi</span>}>
                <SupplierOrderList />
              </DashboardWidget>
            </Row>
          </Col>
        </Row>
      </Container>
    </LoadingOverlay>
  );
}

export default OutletDetails;
