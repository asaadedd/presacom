import LoadingOverlay from "../../../shared/presentations/LoadingOverlay";
import { Col, Container, FormCheck, Row } from "react-bootstrap";
import { ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import {
  getSupplierDetails,
  hideSupplierReturnedOrders,
  importProducts,
  placeSupplierOrder,
  resetSupplierId,
  selectSupplierDetails,
  selectSupplierProducts,
  selectSupplierShowReturnedOrders,
  setSupplierId,
  showSupplierReturnedOrders
} from "../store/supplier";
import { useParams } from "react-router-dom";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import SupplierInfo from "../presentations/SupplierInfo";
import FileSelector from "../../../shared/presentations/FileSelector";
import { OrderEntry, OrderStatuses } from "@presacom/models";
import SupplierOrderList from "../containers/SupplierOrderList";
import CreateOrder from "../../../shared/presentations/CreateOrder";
import TableDisplay from "../../../shared/presentations/TableDisplay";
import { productHeaders } from "../../../shared/models/products";

function SupplierDetails() {
  const supplierDetails = useAppSelector(selectSupplierDetails);
  const products = useAppSelector(selectSupplierProducts);
  const showReturnedOrders = useAppSelector(selectSupplierShowReturnedOrders);
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  const toggleShowReturnedOrder = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      dispatch(showSupplierReturnedOrders());
    } else {
      dispatch(hideSupplierReturnedOrders());
    }
  }

  const onProductsImport = async (file: File) => {
    if (id) {
      await dispatch(importProducts({ file, supplierId: id }));
      dispatch(getSupplierDetails(id));
    }
  };
  const placeOrder = (entries: OrderEntry[]) => {
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
    <Container className="pt-3">
      <Row>
        <Col xs="4" className="pr-2">
          <DashboardWidget title={<span className="fs-4 fw-bold">Detalii</span>} >
            <SupplierInfo supplier={supplierDetails} />
          </DashboardWidget>
        </Col>
        <Col xs="8" className="pr-2">
          <div className="pb-3">
            <DashboardWidget 
              title={<span className="fs-5 fw-bold">Produse</span>}
              actions={<>
                <span className="me-2">
                  <FileSelector
                    title="Importa produse"
                    extension=".xlsx"
                    onFileLoaded={onProductsImport}
                  />
                </span>
                <CreateOrder 
                  products={products}
                  onSubmit={placeOrder}
                />
              </>}
            >
              <TableDisplay useActions={false} useCheckboxes={false} data={products} headers={productHeaders} />
            </DashboardWidget>
          </div>
          <div>
            <DashboardWidget 
              title={<span className="fs-5 fw-bold">Comenzi</span>}
              actions={<FormCheck label="Afiseaza comenzi returnate" onChange={toggleShowReturnedOrder} checked={showReturnedOrders}/>}
            >
              <SupplierOrderList />
            </DashboardWidget>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SupplierDetails;
