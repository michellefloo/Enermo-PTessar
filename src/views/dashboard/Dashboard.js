import React, { Fragment } from "react";
// import DeviceCard from './_content/device-card/DeviceCardOnly'
import DeviceGroupTab from "./_content/device-group-tab/DeviceGroupTab";
import { CRow, CCol } from "@coreui/react";
import TimeConfigProvider from "./_provider/TimeConfigProvider";
// import SensorSummaryTab from './_content/sensor-product-summary-tab/SensorProductSummaryTab'
import DeviceGroupTabErrorHandler from "./_content/device-group-tab/ErrorHandler";
import { CycleDetailModal } from "./_content/modals";

const Dashboard = () => {
  return (
    <TimeConfigProvider>
      <Fragment>
        <CRow>
          <DeviceGroupTab />
        </CRow>
        <CycleDetailModal />
        <DeviceGroupTabErrorHandler />
      </Fragment>
    </TimeConfigProvider>
  );
};

export default Dashboard;
