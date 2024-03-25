import React, { Fragment } from "react";
import { CRow, CCol, CCard } from "@coreui/react";
import DeviceHeaderWidget from "./_content/HeaderWidget";
import ErrorHandler from "./_content/ErrorHandler";
import TimeConfigProvider from "../dashboard/_provider/TimeConfigProvider";
import DeviceSummaryCardFactory from "./_content/device-summary-card/DeviceSummaryCardFactory";
import CycleDetailModal from "./_content/modals/CycleDetailModal";
const DeviceSummaryChart = () => {
  return (
    <TimeConfigProvider>
      <Fragment>
        <CRow>
          <CCol>
            <DeviceHeaderWidget />
          </CCol>
        </CRow>
        <CCard>
          <DeviceSummaryCardFactory />
        </CCard>
        <CycleDetailModal />
        <ErrorHandler />
      </Fragment>
    </TimeConfigProvider>
  );
};

export default DeviceSummaryChart;
