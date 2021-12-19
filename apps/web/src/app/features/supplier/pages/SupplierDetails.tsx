import LoadingOverlay from "../../../shared/presentations/LoadingOverlay";
import { Button, Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getSupplierDetails,
  importProducts,
  placeSupplierOrder,
  resetSupplierId,
  selectSupplierDetails,
  selectSuppliersLoading,
  setSupplierId
} from "../store/supplier";
import { useParams } from "react-router-dom";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import SupplierInfo from "../presentations/SupplierInfo";
import FileSelector from "../../../shared/presentations/FileSelector";
import ProductsList from "../containers/ProductsList";
import { OrderEntry, OrderStatuses } from "@presacom/models";
import SupplierOrderList from "../containers/SupplierOrderList";

function SupplierDetails() {
  const [entries, setEntries] = useState<OrderEntry[]>([]);
  const supplierLoading = useAppSelector(selectSuppliersLoading);
  const supplierDetails = useAppSelector(selectSupplierDetails);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const onProductsImport = async (file: File) => {
    if (id) {
      await dispatch(importProducts({ file, supplierId: id }));
      dispatch(getSupplierDetails(id));
    }
  };
  const placeOrder = () => {
    if (id) {
      dispatch(placeSupplierOrder({
        supplierId: id,
        status: OrderStatuses.DELIVERED,
        entries,
        price: entries.reduce((price, entry) => {
          price += (entry.unitPrice * entry.quantity) ;

          return price;
        }, 0)
      }));
      dispatch(getSupplierDetails(id));
    }
  };

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

export default SupplierDetails;
