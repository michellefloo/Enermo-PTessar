import React, { Fragment, useState, useEffect } from 'react'
import { useGetSensorList } from '../../../api/sensor'
import {
    CCol,
    CRow,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilAudio } from '@coreui/icons'

  const SensorHeaderWidget = () => {
    const {data: rqData, status: rqStatus} = useGetSensorList()
    const [utilityDataLength, setSensorDataLength] = useState('0')
    useEffect(() => {
        if(rqStatus === 'success'){
           if(!rqData) return
           if(!rqData.result) return
           setSensorDataLength(rqData.result.length.toString())
        }
    }, [rqData, rqStatus])
    return (
        <Fragment>
             <CRow>
                {rqStatus === "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CSpinner className="spinner spinner--spacer-bottom"
                            color="info" variant="grow"
                        />
                    </CCol>
                } 
                {rqStatus !== "loading" && 
                    <CCol xs="12" sm="6" lg="4">
                        <CWidgetIcon color="info" iconPadding={false}
                                    header={utilityDataLength} text="Sensors" 
                                    className="font-size-large text-uppercase font-weight-bold"
                        >
                            <CIcon width={24} content={cilAudio} />
                        </CWidgetIcon>
                    </CCol>
                }         
            </CRow>
        </Fragment>
    )
}

export default SensorHeaderWidget