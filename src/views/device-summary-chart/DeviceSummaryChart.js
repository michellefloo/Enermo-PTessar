import React, { Fragment, useContext, useEffect } from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody } from "@coreui/react";
import DeviceHeaderWidget from "./_content/HeaderWidget";
import ErrorHandler from "./_content/ErrorHandler";
import Chart from "./_content/Chart";
import TimeConfigProvider from "../dashboard/_provider/TimeConfigProvider";

const DeviceSummaryChart = () => {
  return (
    <TimeConfigProvider>
      <Fragment>
        <CRow>
          <CCol>
            <DeviceHeaderWidget />
          </CCol>
        </CRow>
        {/* <CRow>
        <CCol xs="12" md="12">
          <HistoryDateSelector />
        </CCol>
      </CRow> */}
        <CCard>
          <CCardHeader>
            <strong>Device Summary Chart</strong>
          </CCardHeader>
          <CCardBody>
            <Chart />
          </CCardBody>
        </CCard>
        <ErrorHandler />
      </Fragment>
    </TimeConfigProvider>
  );
};

export default DeviceSummaryChart;
