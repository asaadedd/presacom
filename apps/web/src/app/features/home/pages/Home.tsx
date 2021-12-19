import { Col, Container, Row } from "react-bootstrap";
import DashboardWidget from "../../../shared/presentations/DashboardWidget";
import ProfitChart from "../../../shared/presentations/ProfitChart";
import TimeboxSelector, { SelectedTime } from "../../../shared/presentations/TimeboxSelector";
import { useState } from "react";

function Home() {
  const [selectedTime, setSelectedTime] = useState<SelectedTime | undefined>();

  return (
    <Container className="pt-3">
      <Row>
        <Col xs="12">
          <h4 className="text-primary">Informatii utile</h4>
        </Col>
        <Col xs="12">
          <DashboardWidget title="Profit"
                           actions={<TimeboxSelector selectedTime={selectedTime} onTimeSelect={setSelectedTime}/>}
          >
            <ProfitChart />
          </DashboardWidget>
        </Col>
      </Row>
    </Container>
  )
}

export default Home;
