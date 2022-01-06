import { Button, Col, Modal, Row } from "react-bootstrap";
import classNames from "classnames";
import { ReactNode, useState } from "react";
import { OrderStatuses } from "@presacom/models";
import { CustomOrderInformation } from "../models/orders";

interface OrderDetailsProps {
  order: CustomOrderInformation;
  additionalInfo?: ReactNode;
  returnOrder?: () => void;
}

function OrderDetails({ order, returnOrder, additionalInfo }: OrderDetailsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClose = () => setShowConfirm(false);
  const handleShow = () => setShowConfirm(true);
  const onReturnOrder = async () => {
    if (returnOrder) {
      returnOrder();
    }
    handleClose();
  }

  return (
    <>
      <div className="d-flex border p-2">
        <Col xs="6" className="border-end">
          <div className="pb-2">
            <div className="fs-6 text-muted">Status</div>
            <div className="fs-6 fw-bold">{order.status}</div>
          </div>
          <div className="pb-2">
            <div className="fs-6 text-muted">Data</div>
            <div className="fs-6 fw-bold">{order.createdAt}</div>
          </div>
          <div className="pb-2">
            <div className="fs-6 text-muted">Pret</div>
            <div className="fs-6 fw-bold">{order.price}</div>
          </div>
          {
            additionalInfo
          }
          {
            order.status !== OrderStatuses.RETURNED && (
              <div className="pb-2" >
                <Button variant="outline-primary" size="sm" onClick={() => handleShow()}>Returneaza</Button>
              </div>
            )
          }
        </Col>
        <Col xs="6" className="ps-4">
          <div className="fs-6 text-muted">Produse</div>
          <div className="pt-3">
            { order.entries.map((e, i) => {
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
      </div>
      <Modal show={showConfirm} onHide={handleClose}>
        <Modal.Body>Doriti sa returnati comanda?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Nu
          </Button>
          <Button variant="primary" onClick={onReturnOrder}>
            Da
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OrderDetails;
