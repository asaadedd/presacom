import { Container } from "react-bootstrap";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getSuppliers, importSuppliers } from "../store/supplier";
import LoadingOverlay from "../../../shared/presentations/LoadingOverlay";
import AddSupplier from "../containers/AddSupplier";
import SuppliersList from "../containers/SuppliersList";
import FileSelector from "../../../shared/presentations/FileSelector";

function Suppliers() {
  const dispatch = useAppDispatch();

  const onFileLoaded = async (file: File) => {
    await dispatch(importSuppliers(file));
    dispatch(getSuppliers());
  };

  useEffect(() => {
    dispatch(getSuppliers());
  }, [dispatch]);

  return (
    <Container className="pt-3">
      <div className="d-flex justify-content-between">
        <AddSupplier />
        <FileSelector
          title="Importa furnizori"
          extension=".xlsx"
          onFileLoaded={onFileLoaded}
        />
      </div>
      <SuppliersList />
    </Container>
  );
}

export default Suppliers;
