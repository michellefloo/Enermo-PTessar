import React, { Fragment, useContext } from "react";
import { CCol, CRow, CWidgetIcon } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBolt } from "@coreui/icons";
import { DeviceSummaryChartContext } from "../_provider/DeviceSummaryChartProvider";

const DeviceSummaryChartHeaderWidget = () => {
  const { selectedDevice } = useContext(DeviceSummaryChartContext);
  return (
    <Fragment>
      <CRow>
        <CCol xs="12" sm="6" lg="4" style={{ minWidth: "200px" }}>
          <CWidgetIcon
            color="info"
            iconPadding={false}
            header={selectedDevice.name ? selectedDevice.name : "unknown"}
            text="Device Realtime Summary"
            className="font-size-large text-uppercase font-weight-bold"
          >
            <CIcon width={24} content={cilBolt} />
          </CWidgetIcon>
        </CCol>
      </CRow>
    </Fragment>
  );
};

export default DeviceSummaryChartHeaderWidget;
