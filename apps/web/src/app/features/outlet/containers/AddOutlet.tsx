import { useAppDispatch } from "../../../store";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import React, { useState } from "react";
import { SupplierDto } from "@presacom/models";
import { Button, Modal } from "react-bootstrap";
import * as yup from 'yup';
import { addOutlet } from "../store/outlet";

const schema = yup.object({
  name: yup.string()
    .required('Numele este obligatoriu'),
  address: yup.string()
    .required('Adresa este obligatorie'),
  phoneNumber: yup.string()
    .length(10, 'Numarul de telefon nu este corect'),
  email: yup.string()
    .email('Emailul nu este corect'),
}).required();

function AddOutlet() {
  const dispatch = useAppDispatch();
  const {register, formState: { errors }, handleSubmit, reset} = useForm({resolver: yupResolver(schema)});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    reset();
  };
  const onSubmit = async (data: SupplierDto) => {
    await dispatch(addOutlet(data));
    handleClose();
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>Adauga distribuitor</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          Distribuitor
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Nume</label>
              <input type="text"
                     id="name"
                     className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                     {...register("name")}  />
              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Adresa</label>
              <textarea id="address"
                        rows={2}
                        className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                        {...register("address")} />
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Numar de telefon</label>
              <input type="text"
                     id="phoneNumber"
                     className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                     {...register("phoneNumber")} />
              {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="text"
                     id="email"
                     className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                     {...register("email")}  />
              {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Anuleaza
          </Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Salveaza
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddOutlet;
