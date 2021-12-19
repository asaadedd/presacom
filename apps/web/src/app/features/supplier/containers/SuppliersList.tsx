import React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { deleteSupplier, getSuppliers, selectSuppliers } from "../store/supplier";
import { supplierHeaders, SupplierInformation } from "../models/suppliers";
import { useNavigate } from "react-router-dom";
import TableDisplay from "../../../shared/presentations/TableDisplay";

function SuppliersList() {
  const suppliers = useAppSelector(selectSuppliers);
  const dispatch = useAppDispatch();
  const headers = supplierHeaders;
  const navigate = useNavigate();

  const goToSupplierDetails = (sup: SupplierInformation) => {
    navigate(`/suppliers/${sup._id}`);
  };
  const deleteProvider = async (id?: string) => {
    if (id) {
      await dispatch(deleteSupplier(id));
      dispatch(getSuppliers());
    }
  };

  if (!suppliers.length) {
    return null;
  }

  return (
    <div className="mt-3">
      <TableDisplay data={suppliers}
                    headers={headers}
                    onRowDeleted={deleteProvider}
                    onRowSelected={goToSupplierDetails} />
    </div>
  )
}

export default SuppliersList;

