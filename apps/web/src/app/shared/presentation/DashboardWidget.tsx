import { Card, Col, Row } from "react-bootstrap";
import { ComponentProps } from "../models/component";
import React from "react";

interface DashboardWidgetProps {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
}

function DashboardWidget({children, title, actions}: ComponentProps<DashboardWidgetProps>) {
  return (
    <Card className="shadow-sm">
      <Card.Header>
        <div className="d-flex justify-content-between">
          <div>{title}</div>
          <div>{actions}</div>
        </div>
      </Card.Header>
      {children}
    </Card>
  )
}

export default DashboardWidget
