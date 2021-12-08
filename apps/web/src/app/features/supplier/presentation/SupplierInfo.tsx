import { supplierHeaders, SupplierInformation } from "../models/suppliers";

interface SupplierInformationProps {
  supplier: SupplierInformation;
}

function SupplierInfo({ supplier }: SupplierInformationProps) {
  return (
    <div className="p-3">
      {
        supplierHeaders.map(({ key, name}) => (
          <div className="pb-2">
            <div className="fs-6 text-muted">{name}</div>
            <div className="fs-6 fw-bold">{supplier[key]}</div>
          </div>
        ))
      }
    </div>
  );
}

export default SupplierInfo;
