import { useAppDispatch, useAppSelector } from "../../../store";
import { getSupplierDetails, returnSupplierOrder, selectSupplierOrders } from "../store/supplier";
import { Button, Col, Modal, Row } from "react-bootstrap";
import classNames from "classnames";
import React, { useState } from "react";
import { CustomOrderInformation } from "../../../shared/models/orders";
import { OrderStatuses, SupplierOrderDto } from "@presacom/models";

function SupplierOrderList() {
  const orders = useAppSelector(selectSupplierOrders);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToReturn, setOrderToReturn] = useState<CustomOrderInformation<SupplierOrderDto> | null>(null);
  const dispatch = useAppDispatch();

  const handleClose = () => setShowConfirm(false);
  const handleShow = (ord: CustomOrderInformation<SupplierOrderDto>) => {
    setOrderToReturn(ord);
    setShowConfirm(true);
  };
  const returnOrder = async () => {
    if (orderToReturn) {
      await dispatch(returnSupplierOrder(orderToReturn));
      dispatch(getSupplierDetails(orderToReturn.supplierId));
      setOrderToReturn(null);
    }
    handleClose();
  }

  return (
    <>
    {
      orders.map((ord) =>
        <Row key={ord._id} className="border my-3 p-2">
          <Col xs="6" className="border-end">
            <div className="pb-2">
              <div className="fs-6 text-muted">Status</div>
              <div className="fs-6 fw-bold">{ord.status}</div>
            </div>
            <div className="pb-2">
              <div className="fs-6 text-muted">Data</div>
              <div className="fs-6 fw-bold">{ord.createdAt}</div>
            </div>
            <div className="pb-2">
              <div className="fs-6 text-muted">Pret</div>
              <div className="fs-6 fw-bold">{ord.price}</div>
            </div>
            {
              ord.status !== OrderStatuses.RETURNED && (
                <div className="pb-2" >
                  <Button variant="outline-primary" size="sm" onClick={() => handleShow(ord)}>Returneaza</Button>
                </div>
              )
            }
          </Col>
          <Col xs="6" className="ps-4">
            <div className="fs-6 text-muted">Produse</div>
            <div className="pt-3">
              { ord.entries.map((e, i) => {
                const classes = classNames({
                  'p-1': true,
                  'border-bottom': true,
                  'border-top': i===0,
                });
                return (
                  <div className={classes} key={e.productName}>
                    <span className="fw-bold">{e.productName}</span>
                    <span className="px-3">x</span>
                    <span>{e.quantity}</span>
                  </div>
                )
              })}
            </div>
          </Col>
        </Row>
      )
    }
    <Modal show={showConfirm} onHide={handleClose}>
      <Modal.Body>Doriti sa returnati comanda?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Nu
        </Button>
        <Button variant="primary" onClick={returnOrder}>
          Da
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  );
}

export default SupplierOrderList;