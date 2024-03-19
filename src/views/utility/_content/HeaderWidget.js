import React, { Fragment, useState, useEffect } from "react";
import { useGetUtilityList } from "../../../api/utility";
import { CCol, CRow, CWidgetIcon, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";

const UtilityHeaderWidget = () => {
  const { data: rqData, status: rqStatus } = useGetUtilityList();
  const [utilityDataLength, setUtilityDataLength] = useState("0");
  useEffect(() => {
    if (rqStatus === "success") {
      if (!rqData) return;
      if (!rqData.result) return;
      setUtilityDataLength(rqData.result.length.toString());
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
              header={utilityDataLength}
              text="Utilities"
              className="font-size-large text-uppercase font-weight-bold"
            >
              <CIcon width={24} name="cil-input-power" />
            </CWidgetIcon>
          </CCol>
        )}
      </CRow>
    </Fragment>
  );
};

export default UtilityHeaderWidget;
