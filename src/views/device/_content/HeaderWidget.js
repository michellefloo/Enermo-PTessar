import React, { Fragment, useState, useEffect } from "react";
import { useGetDeviceList } from "../../../api/device";
import { CCol, CRow, CWidgetIcon, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilBolt } from "@coreui/icons";

const DeviceHeaderWidget = () => {
  const { data: rqData, status: rqStatus } = useGetDeviceList();
  const [deviceDataLength, setBoundaryDataLength] = useState("0");
  useEffect(() => {
    if (rqStatus === "success") {
      if (!rqData) return;
      if (!rqData.result) return;
      setBoundaryDataLength(rqData.result.length.toString());
    }
  }, [rqData, rqStatus]);
  return (
    <Fragment>
      <CRow>
        {rqStatus === "loading" && (
          <CCol xs="12" sm="6" lg="4">
            <CSpinner
              className="spinner spinner--spacer-bottom"
              color="info"
              variant="grow"
            />
          </CCol>
        )}
        {rqStatus !== "loading" && (
          <CCol xs="12" sm="6" lg="6" style={{ minWidth: "200px" }}>
            <CWidgetIcon
              color="info"
              iconPadding={false}
              header={deviceDataLength}
              text="Devices"
              className="font-size-large text-uppercase font-weight-bold"
            >
              <CIcon width={24} content={cilBolt} />
            </CWidgetIcon>
          </CCol>
        )}
      </CRow>
    </Fragment>
  );
};

export default DeviceHeaderWidget;
