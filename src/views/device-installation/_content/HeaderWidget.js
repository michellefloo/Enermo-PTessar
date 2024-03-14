import React, { Fragment, useState, useEffect, useContext } from 'react'
import { useGetDeviceInstallByIddDeviceList } from '../../../api/device-installation'
import {
    CCol,
    CRow,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilCalendar } from '@coreui/icons'
  import { DeviceSelectContext } from '../_provider/DeviceSelectProvider'

  const DeviceInstallationHeaderWidget = () => {
    const {selectedDevice} = useContext(DeviceSelectContext)
    const {data: rqData, status: rqStatus} = useGetDeviceInstallByIddDeviceList(selectedDevice)
    const [utilityDataLength, setDeviceInstallationDataLength] = useState('0')
    useEffect(() => {
        if(rqStatus === 'success'){
            if(!rqData.result) return
           setDeviceInstallationDataLength(rqData.result.length.toString())
        }
    }, [rqData, rqStatus])
    return (
        <Fragment>
             <CRow>
                {rqStatus === "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CSpinner className="spinner spinner--spacer-bottom"
                            color="primary" variant="grow"
                        />
                    </CCol>
                } 
                {rqStatus !== "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CWidgetIcon color="info" iconPadding={false}
                                    header={utilityDataLength} text="Device Installations" 
                                    className="font-size-large text-uppercase font-weight-bold"
                        >
                            <CIcon width={24} content={cilCalendar} />
                        </CWidgetIcon>
                    </CCol>
                }         
            </CRow>
        </Fragment>
    )
}

export default DeviceInstallationHeaderWidget