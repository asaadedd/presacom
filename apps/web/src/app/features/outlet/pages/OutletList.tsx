import { useAppDispatch, useAppSelector } from "../../../store";
import React, { useEffect } from "react";
import LoadingOverlay from "../../../shared/presentations/LoadingOverlay";
import { Container } from "react-bootstrap";
import FileSelector from "../../../shared/presentations/FileSelector";
import { deleteOutlet, getOutlets, importOutlets, selectOutlets, selectOutletsLoading } from "../store/outlet";
import TableDisplay from "../../../shared/presentations/TableDisplay";
import { outletsHeaders } from "../models/outlets";
import AddOutlet from "../containers/AddOutlet";
import { useNavigate } from "react-router-dom";
import { OutletDto } from "@presacom/models";

function OutletList() {
  const dispatch = useAppDispatch();
  const outletsLoading = useAppSelector(selectOutletsLoading);
  const outlets = useAppSelector(selectOutlets);
  const navigate = useNavigate();

  const deleteOutletDetails = (id: string) => {
    dispatch(deleteOutlet(id));
  };
  const goToOutletDetails = (outlet: OutletDto) => {
    navigate(`/outlets/${outlet._id}`);
  };
  const onFileLoaded = (file: File) => {
    dispatch(importOutlets(file));
  };

  useEffect(() => {
    dispatch(getOutlets());
  }, [dispatch]);

  return (
    <LoadingOverlay
      loading={outletsLoading}
      text='Se incarca distribuitori...'
    >
      <Container className="pt-3">
        <div className="d-flex justify-content-between">
          <AddOutlet />
          <FileSelector
            title="Importa distribuitori"
            extension=".xlsx"
            onFileLoaded={onFileLoaded}
          />
        </div>
        <div className="mt-3">
          <TableDisplay data={outlets} headers={outletsHeaders} onRowDeleted={deleteOutletDetails} onRowSelected={goToOutletDetails} />
        </div>
      </Container>
    </LoadingOverlay>
  );
}

export default OutletList;
