import { OutletDto } from "@presacom/models";

interface OutletInfoProps {
  outlet: OutletDto;
}

function OutletInfo({ outlet }: OutletInfoProps) {
  return (<>
    <div className="pb-2">
      <div className="fs-6 text-muted">Nume</div>
      <div className="fs-6 fw-bold">{outlet.name}</div>
    </div>
    <div className="pb-2">
      <div className="fs-6 text-muted">Adresa</div>
      <div className="fs-6 fw-bold">{outlet.address}</div>
    </div>
    <div className="pb-2">
      <div className="fs-6 text-muted">Numar de telefon</div>
      <div className="fs-6 fw-bold">{outlet.phoneNumber}</div>
    </div>
    <div className="pb-2">
      <div className="fs-6 text-muted">Email</div>
      <div className="fs-6 fw-bold">{outlet.email}</div>
    </div>
  </>);
}

export default OutletInfo;
