import { Container } from "react-bootstrap";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSuppliers, selectSuppliersLoading } from "../store/supplier";
import LoadingOverlay from "../../../shared/presentation/LoadingOverlay";
import AddSupplier from "../container/AddSupplier";
import ImportSupplier from "../container/ImportSupplier";
import SuppliersList from "../container/SuppliersList";

function Suppliers() {
  const dispatch = useAppDispatch();
  const suppliersLoading = useAppSelector(selectSuppliersLoading);

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  return (
    <LoadingOverlay
      loading={suppliersLoading}
      text='Se incarca furnizori...'
    >
      <Container className="pt-3">
        <div className="d-flex justify-content-between">
          <AddSupplier />
          <ImportSupplier />
        </div>
        <SuppliersList />
      </Container>
    </LoadingOverlay>
  );
}

export default Suppliers;
