import React, { Fragment, useContext } from "react";
// import { useGetGroupInstallByIddGroupList } from '../../../api/device-installation'
import { CCol, CRow, CWidgetIcon, CSpinner } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilObjectGroup } from "@coreui/icons";
import { GroupSelectContext } from "../_provider/GroupSelectProvider";

const GroupInstallationHeaderWidget = () => {
  const { deviceUponShow } = useContext(GroupSelectContext);
  // const {data: rqData, status: rqStatus} = useGetGroupInstallByIddGroupList(selectedGroup)
  // const [utilityDataLength, setGroupInstallationDataLength] = useState('0')
  // useEffect(() => {
  //     if(rqStatus === 'success'){
  //         if(!rqData.result) return
  //        setGroupInstallationDataLength(rqData.result.length.toString())
  //     }
  // }, [rqData, rqStatus])
  return (
    <Fragment>
      <CRow>
        {/* {rqStatus === "loading" &&  */}
        {/* <CCol xs="12" sm="6" lg="4">
                        <CSpinner className="spinner spinner--spacer-bottom"
                            color="primary" variant="grow"
                        />
                    </CCol> */}
        {/* }  */}
        {/* {rqStatus !== "loading" &&  */}
        <CCol xs="12" sm="6" lg="6" style={{ minWidth: "200px" }}>
          <CWidgetIcon
            color="info"
            iconPadding={false}
            header={String(deviceUponShow.length)}
            text="Default Group"
            className="font-size-large text-uppercase font-weight-bold"
          >
            <CIcon width={24} content={cilObjectGroup} />
          </CWidgetIcon>
        </CCol>
        {/* }          */}
      </CRow>
    </Fragment>
  );
};

export default GroupInstallationHeaderWidget;
