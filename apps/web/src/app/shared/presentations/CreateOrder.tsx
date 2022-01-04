import { OrderEntry, ProductWithStock } from "@presacom/models";
import * as yup from 'yup';
import React, { ReactNode, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FieldErrors, useForm, UseFormRegister } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

interface CreateOrderProps {
  products: ProductWithStock[];
  getAdditionalControls?: (register: UseFormRegister<any>, errors: FieldErrors) => ReactNode;
  onSubmit: (entries: OrderEntry[]) => void;
}

function CreateOrder({products, onSubmit, getAdditionalControls}: CreateOrderProps) {
  const getId = (product: ProductWithStock) => {
    return product._id || product.title;
  }
  const getSchema = () => {
    const schema: any = {};
    products.forEach((prod) => {
      schema[getId(prod)] = yup.number().max(prod.quantity, 'Cantitatea este mai mare decat stocul')
    })
    return yup.object(schema).required();
  }
  const [schema] = useState(getSchema());
  const {register, formState: { errors }, handleSubmit, reset} = useForm({resolver: yupResolver(schema)});
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
    onSubmit(entries);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>Plaseaza comanda</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <form>
            {
              products.map((prod) =>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">{prod.title}</label>
                  <input type="number"
                         id="name"
                         className={`form-control ${errors[getId(prod)] ? 'is-invalid' : ''}`}
                         {...register(getId(prod))}  />
                  {errors[getId(prod)] && <div className="invalid-feedback">{errors[getId(prod)].message}</div>}
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
          <Button variant="primary" onClick={handleSubmit(onFormSubmit)}>
            Plaseaza comanda
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreateOrder;
