import React, { Fragment } from "react";
import { CCol, CRow, CCard, CCardHeader, CCardBody } from "@coreui/react";
import HeaderWidget from "./_content/HeaderWidget";
import Datatable from "./_content/Datatable";
import DeviceErrorHandler from "./_content/ErrorHandler";
import TimeConfigProvider from "../dashboard/_provider/TimeConfigProvider";
const DeviceSummaryTable = () => {
  return (
    <TimeConfigProvider>
      <Fragment>
        <CRow>
          <CCol>
            <HeaderWidget />
          </CCol>
        </CRow>
        <CCard>
          <CCardHeader>
            <strong>Device Summary Table</strong>
          </CCardHeader>
          <CCardBody>
            <Datatable />
          </CCardBody>
        </CCard>
        <DeviceErrorHandler />
      </Fragment>
    </TimeConfigProvider>
  );
};

export default DeviceSummaryTable;
