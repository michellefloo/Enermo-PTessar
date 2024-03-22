import React, { Fragment, useContext } from "react";
import { CRow, CCol } from "@coreui/react";
import DeviceHeaderWidget from "./_content/HeaderWidget";
import HistoryDateSelector from "./_content/HistoryDateSelector";
import DeviceHistoryTable from "./_content/Datatable";
import ErrorHandler from "./_content/ErrorHandler";
// import DeviceActionButtonContainer from './_content/ActionButtonsContainer'
import { DeviceHistoryContext } from "./_provider/DeviceHistoryProvider";

const DeviceHistory = () => {
  const { selectedStartDate, selectedEndDate } =
    useContext(DeviceHistoryContext);
  return (
    <Fragment>
      <CRow>
        <CCol>
          <DeviceHeaderWidget />
        </CCol>
        {/* <CCol>
                    <DeviceActionButtonContainer />
                </CCol> */}
      </CRow>
      <CRow>
        <CCol xs="12" md="12">
          <HistoryDateSelector />
        </CCol>
      </CRow>
      {
        selectedStartDate && selectedEndDate && (
          //  <CCard>
          //  <CCardHeader>
          //      <strong>History</strong>
          //  </CCardHeader>
          //  <CCardBody>
          <DeviceHistoryTable />
        )
        //      </CCardBody>
        //  </CCard>
      }
      <ErrorHandler />
    </Fragment>
  );
};

export default DeviceHistory;
