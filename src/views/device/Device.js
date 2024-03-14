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
import Datatable from './_content/datatable/Datatable'
import DeviceErrorHandler from './_content/ErrorHandler'
import {
    DeviceAddModal,
    DeviceEditModal,
    DeviceDeleteModal
} from './_content/modals'

const Device = () => {
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
                    <strong>Device List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <DeviceAddModal />
            <DeviceEditModal />
            <DeviceDeleteModal />
            <DeviceErrorHandler />
        </Fragment>
    )
}
export default Device