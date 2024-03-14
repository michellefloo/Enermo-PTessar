import React, { Fragment } from 'react'
import {
    CCol,
    CRow,
    CCard,
    CCardHeader,
    CCardBody
} from '@coreui/react'
import HeaderWidget from './_content/HeaderWidget'
import ActionButtonsContainer from './_content/ActionButtonsContainer'
import Datatable from './_content/Datatable'
import SensorErrorHandler from './_content/ErrorHandler'
import {
    SensorAddModal,
    SensorEditModal,
    SensorDeleteModal
} from './_content/modals'
const Sensor = () => {
    return(
        <Fragment>
            <CRow>
                <CCol>
                    <HeaderWidget />
                </CCol>
                <CCol>
                    <ActionButtonsContainer />
                </CCol>
            </CRow>
            <CCard>
                <CCardHeader>
                    <strong>Sensor List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <SensorAddModal />
            <SensorEditModal />
            <SensorDeleteModal />
            <SensorErrorHandler />
        </Fragment>
    )
}
export default Sensor