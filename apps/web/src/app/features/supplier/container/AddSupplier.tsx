import { Button, Modal } from "react-bootstrap";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../../store";
import { addSupplier } from "../store/supplier";
import { SupplierDto } from "@presacom/models";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string()
    .required('Numele este obligatoriu'),
  registrationNumber: yup.string()
    .required('Numarul de inregistrare este obligatoriu')
    .length(13, 'Numarul de inregistrare nu are 13 caractere'),
  cui: yup.string()
    .required('CUI-ul este obligatoriu')
    .max(12, 'CUI-ul are maxim 12 caractere'),
  address: yup.string()
    .required('Adresa este obligatorie'),
  phoneNumber: yup.string()
    .length(10, 'Numarul de telefon nu este corect'),
  iban: yup.string()
    .required('IBAN-ul este obligatoriu')
    .length(24, 'IBAN-ul nu are 24 de caractere'),
  email: yup.string()
    .email('Emailul nu este corect'),
}).required();

function AddSupplier() {
  const dispatch = useAppDispatch();
  const {register, formState: { errors }, handleSubmit, reset} = useForm({resolver: yupResolver(schema)});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    reset();
  };
  const onSubmit = async (data: SupplierDto) => {
    await dispatch(addSupplier(data));
    handleClose();
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>Adauga furnizor</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          Furnizor
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
              <label htmlFor="registrationNumber" className="form-label">Numar de inregistrare</label>
              <input type="text"
                     id="registrationNumber"
                     className={`form-control ${errors.registrationNumber ? 'is-invalid' : ''}`}
                     {...register("registrationNumber")} />
              {errors.registrationNumber && <div className="invalid-feedback">{errors.registrationNumber.message}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="cui" className="form-label">CUI</label>
              <input type="text"
                     id="cui"
                     className={`form-control ${errors.cui ? 'is-invalid' : ''}`}
                     {...register("cui")} />
              {errors.cui && <div className="invalid-feedback">{errors.cui.message}</div>}
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
              <label htmlFor="iban" className="form-label">IBAN</label>
              <input type="text"
                     id="iban"
                     className={`form-control ${errors.iban ? 'is-invalid' : ''}`}
                     {...register("iban")} />
              {errors.iban && <div className="invalid-feedback">{errors.iban.message}</div>}
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

export default AddSupplier;
