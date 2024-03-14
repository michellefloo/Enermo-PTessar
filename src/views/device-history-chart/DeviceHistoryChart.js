import React, { Fragment, useContext, useEffect } from 'react'
import {
    CRow, CCol,
    CCard,
    CCardHeader,
    CCardBody
} from '@coreui/react'
import DeviceHeaderWidget from './_content/HeaderWidget'
import HistoryDateSelector from './_content/HistoryDateSelector'
// import DeviceHistoryTable from './_content/Datatable'
import ErrorHandler from './_content/ErrorHandler'
// import DeviceActionButtonContainer from './_content/ActionButtonsContainer'
import { DeviceHistoryContext2 } from './_provider/DeviceHistoryChartProvider'
import Chart from './_content/Chart'

const DeviceHistory = () => {
    const {selectedStartDate} = useContext(DeviceHistoryContext2) 
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
            {selectedStartDate &&
                 <CCard>
                 <CCardHeader>
                     <strong>History Chart</strong>
                 </CCardHeader>
                 <CCardBody>
                    <Chart />
            </CCardBody>
            </CCard>
            }
            <ErrorHandler />
        </Fragment> 
    )
}

export default DeviceHistory