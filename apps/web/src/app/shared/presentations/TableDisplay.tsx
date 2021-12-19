import { Button, FormCheck, Table } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { TableHeader } from "../models/table";

interface TableDisplayProps<T = any> {
  data: T[];
  checkedIds?: string[];
  useCheckboxes?: boolean;
  headers: TableHeader<string>[];
  onRowSelected: (data: T) => void;
  onRowDeleted: (id: string) => void;
  onRowChecked?: (ids: string[]) => void;
}

function TableDisplay({ checkedIds, headers, data, onRowSelected, onRowDeleted, onRowChecked, useCheckboxes }: TableDisplayProps) {
  const [checkedRows, setCheckedRows] = useState<string[]>([]);
  const [isAllChecked, setAllChecked] = useState(false);

  const checkAll = () => {
    if (isAllChecked) {
      setCheckedRows([]);
      setAllChecked(false);
      if (onRowChecked) {
        onRowChecked([]);
      }
    } else {
      const allIds = data.map(({ _id }) => _id);
      setCheckedRows(allIds);
      setAllChecked(true);
      if (onRowChecked) {
        onRowChecked(allIds);
      }
    }
  }
  const checkRow = (id: string, isSelected: boolean) => {
    const newChecked = checkedRows.slice(0);
    if (isSelected) {
      newChecked.push(id);
    } else {
      const indexOfElement = newChecked.indexOf(id);

      if (indexOfElement > -1) {
        newChecked.splice(indexOfElement, 1);
      }
    }
    setCheckedRows(newChecked);
    if (onRowChecked) {
      onRowChecked(newChecked);
    }
  };

  useEffect(() => {
    if (checkedIds) {
      const isAllChecked = !data.some(({ _id }) => !checkedIds.includes(_id))
      setCheckedRows(checkedIds);
      setAllChecked(isAllChecked);
    } else {
      setCheckedRows([]);
      setAllChecked(false);
    }
  }, [checkedIds, data])

  return (
    <Table hover>
      <thead><tr className="table-primary">
        {
          useCheckboxes && <th>
            <FormCheck onChange={checkAll} checked={isAllChecked}/>
          </th>
        }
        {
          headers.map(({ name }) => (
            <th key={name}>{name}</th>
          ))
        }
        <th></th>
      </tr></thead>
      <tbody style={{border: 0, borderColor: 'var(--bs-gray-300)'}}>
      {
        data.map((sup) => (
          <tr key={sup._id} style={{ cursor: 'pointer' }}>
            {
              useCheckboxes && <td>
                <FormCheck checked={checkedIds?.includes(sup._id) || isAllChecked}
                           onChange={(event) => checkRow(sup._id, event.target.checked)} />
              </td>
            }
            {
              headers.map(({key}) => (
                <td key={`${sup._id}_${key}`} onClick={() => onRowSelected(sup)}>{sup[key]}</td>
              ))
            }
            <td>
              <Button variant="danger" size="sm" onClick={() => onRowDeleted(sup._id)}>Delete</Button>
            </td>
          </tr>
        ))
      }
      </tbody>
    </Table>
  )
}

export default TableDisplay;
