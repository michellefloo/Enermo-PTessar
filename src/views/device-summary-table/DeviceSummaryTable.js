import React, { Fragment } from "react";
import { CCol, CRow, CCard, CCardHeader, CCardBody } from "@coreui/react";
import HeaderWidget from "./_content/HeaderWidget";
import Datatable from "./_content/Datatable";
import DeviceErrorHandler from "./_content/ErrorHandler";

const DeviceSummaryTable = () => {
  return (
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
    </Fragment>
  );
};

export default DeviceSummaryTable;
