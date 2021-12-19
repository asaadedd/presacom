import { supplierHeaders, SupplierInformation } from "../models/suppliers";

interface SupplierInformationProps {
  supplier: SupplierInformation;
}

function SupplierInfo({ supplier }: SupplierInformationProps) {
  return (
    <>
      {
        supplierHeaders.map(({ key, name}) => (
          <div key={key} className="pb-2">
            <div className="fs-6 text-muted">{name}</div>
            <div className="fs-6 fw-bold">{supplier[key]}</div>
          </div>
        ))
      }
    </>
  )
}

export default SupplierInfo;
