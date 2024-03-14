import React, { Fragment, useContext } from 'react'
import {
    CCol,
    CRow,
    CWidgetIcon,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilBolt } from '@coreui/icons'
  import { DeviceHistoryContext2 } from '../_provider/DeviceHistoryChartProvider'

  const DeviceInstallationHeaderWidget = () => {
    const {selectedDevice} = useContext(DeviceHistoryContext2)
    return (
        <Fragment>
             <CRow>
                <CCol xs="12" sm="6" lg="4">
                    <CWidgetIcon color="info" iconPadding={false}
                                header={selectedDevice.name? selectedDevice.name : "unknown"} text="History Device" 
                                className="font-size-large text-uppercase font-weight-bold"
                    >
                        <CIcon width={24} content={cilBolt} />
                    </CWidgetIcon>
                </CCol>
            </CRow>
        </Fragment>
    )
}

export default DeviceInstallationHeaderWidget