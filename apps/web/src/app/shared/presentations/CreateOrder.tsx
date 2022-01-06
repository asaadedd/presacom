import { OrderEntry, ProductWithStock } from "@presacom/models";
import * as yup from 'yup';
import React, { ReactNode, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

interface CreateOrderProps {
  buttonText?: string;
  submitText?: string;
  products: ProductWithStock[];
  getAdditionalControls?: (register: UseFormRegister<any>, errors: FieldErrors) => ReactNode;
  onSubmit: (entries: OrderEntry[], formData: any) => void;
}

function CreateOrder({products, onSubmit, getAdditionalControls, buttonText, submitText}: CreateOrderProps) {
  const getId = (product: ProductWithStock) => {
    return product._id || product.title;
  }
  const {register, formState: { errors }, handleSubmit, reset} = useForm();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    reset();
  };
  const onFormSubmit = async (data: any) => {
    const entries: OrderEntry[] = [];
    products.forEach((prod) => {
      const quantity = data[getId(prod)];
      const quantityNumber = parseInt(quantity, 10);
      if (quantityNumber) {
        entries.push({
          productName: prod.title,
          productId: prod._id as string,
          quantity: quantityNumber,
          unitPrice: prod.price
        });
      }
    });
    if (entries.length) {
      onSubmit(entries, data);
      handleClose();
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>{ buttonText || 'Plaseaza comanda'}</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <form>
            {
              products.map((prod) =>
                <div className="mb-3" key={prod._id}>
                  <label htmlFor="name" className="form-label">{prod.title}</label>
                  <input type="number"
                         id="name"
                         className={`form-control ${errors[getId(prod)] ? 'is-invalid' : ''}`}
                         {...register(getId(prod), { max: prod.quantity })}  />
                  {errors[getId(prod)] && <div className="invalid-feedback">Cantitatea este mai mare decat stocul</div>}
                </div>
              )
            }
            {
              getAdditionalControls && getAdditionalControls(register, errors)
            }
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Anuleaza
          </Button>
          <Button variant="primary" disabled={!!Object.keys(errors).length} onClick={handleSubmit(onFormSubmit)}>
            { submitText || 'Plaseaza comanda'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateOrder;
