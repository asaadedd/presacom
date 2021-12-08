import { Button } from "react-bootstrap";
import React, { useEffect } from "react";
import { useFilePicker } from "use-file-picker";
import { importSuppliers } from "../store/supplier";
import { useAppDispatch } from "../../../store";

function ImportSupplier() {
  const dispatch = useAppDispatch();
  const [openFileSelector, { plainFiles }] = useFilePicker({
    accept: '.xlsx'
  });

  useEffect(() => {
    if (plainFiles?.length) {
      dispatch(importSuppliers(plainFiles[0]));
    }
  }, [dispatch, plainFiles]);

  return (
    <Button variant="primary" size="sm" onClick={() => openFileSelector()}>Importa furnizori</Button>
  );
}

export default ImportSupplier;
