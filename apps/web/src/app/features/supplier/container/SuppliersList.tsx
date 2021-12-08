import { Table } from "react-bootstrap";
import React from "react";
import { useAppSelector } from "../../../store";
import { selectSuppliers } from "../store/supplier";
import { supplierHeaders, SupplierInformation } from "../models/suppliers";
import { useNavigate } from "react-router-dom";

function SuppliersList() {
  const suppliers = useAppSelector(selectSuppliers);
  const headers = supplierHeaders;
  const navigate = useNavigate();

  const goToSupplierDetails = (sup: SupplierInformation) => {
    navigate(`/suppliers/${sup._id}`);
  }

  if (!suppliers.length) {
    return null;
  }

  return (
    <Table hover className="mt-3">
      <thead><tr className="table-primary">
        {
          headers.map(({ name }) => (
            <th>{name}</th>
          ))
        }
      </tr></thead>
      <tbody style={{border: 0, borderColor: 'var(--bs-gray-300)'}}>
        {
          suppliers.map((sup) => (
            <tr style={{ cursor: 'pointer' }} onClick={() => goToSupplierDetails(sup)}>
              {
                headers.map(({key}) => (
                  <td>{sup[key]}</td>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </Table>
  )
}

export default SuppliersList;

