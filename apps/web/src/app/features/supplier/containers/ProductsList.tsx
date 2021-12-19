import { useAppSelector } from "../../../store";
import { selectSupplierProducts } from "../store/supplier";
import { Form, Table } from "react-bootstrap";
import React, { useState } from "react";
import { productHeaders } from "../../../shared/models/products";
import { OrderEntry, ProductWithStock } from "@presacom/models";

interface ProductsListProps {
  onEntryChanged: (newQuantity: OrderEntry[]) => void
}

function ProductsList({ onEntryChanged }: ProductsListProps) {
  const products = useAppSelector(selectSupplierProducts);
  const [entries, setEntries] = useState<OrderEntry[]>([]);
  const headers = productHeaders;

  const changeProductQuantity = (prod: ProductWithStock, quantity: string) => {
    const newEntries = entries.slice(0);
    const indexOfEntry = entries.findIndex(({ productId }) => productId === prod._id);
    const quantityNumber = parseInt(quantity, 10);
    if (quantityNumber) {
      if (indexOfEntry > -1) {
        const currentEntry = entries[indexOfEntry];
        newEntries.splice(indexOfEntry, 1, {
          ...currentEntry,
          quantity: quantityNumber
        });
      } else {
        newEntries.push({
          productName: prod.title,
          productId: prod._id as string,
          quantity: quantityNumber,
          unitPrice: prod.price
        });
      }
    } else if (indexOfEntry > -1){
      newEntries.splice(indexOfEntry, 1);
    }
    setEntries(newEntries);
    onEntryChanged(newEntries);
  };

  if (!products.length) {
    return null;
  }

  return (
    <Table hover>
      <thead><tr className="table-primary">
        {
          headers.map(({ name }, i) => (
            <th key={i}>{name}</th>
          ))
        }
        <th></th>
      </tr></thead>
      <tbody style={{border: 0, borderColor: 'var(--bs-gray-300)'}}>
      {
        products.map((prod) => (
          <tr key={prod._id} style={{ cursor: 'pointer' }}>
            {
              headers.map(({key}) => (
                <td key={`${prod._id}_${key}`}>{prod[key]}</td>
              ))
            }
            <td>
              <Form.Control
                type="number"
                max={prod.quantity}
                size="sm"
                style={{ width: '75px'}}
                onChange={(event) => changeProductQuantity(prod, event.target.value)}
              />
            </td>
          </tr>
        ))
      }
      </tbody>
    </Table>
  )
}

export default ProductsList;
