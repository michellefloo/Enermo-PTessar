import React from 'react'
import {
    CCol,
    CRow,
    CCard,
    CCardBody,
    CCardHeader,
} from '@coreui/react'
import FilterContainer from './_content/FilterContainer'
import HeaderWidget from './_content/HeaderWidget'
import ActionButtonsContainer from './_content/ActionButtonsContainer'
import Datatable from './_content/Datatable'
import DeviceInstallationErrorHandler from './_content/ErrorHandler'
import DeviceSelectProvider  from './_provider/DeviceSelectProvider'
import {
    DeviceInstallationAddModal,
    EditCalibrationModal,
    RemoveInstallationModal
} from './_content/modals'
const DeviceInstallation = () => {
    return(
        <DeviceSelectProvider>
            <CRow>
                <CCol>
                    <FilterContainer />
                </CCol>
            </CRow>
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
                    <strong>Device Installation List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <DeviceInstallationAddModal />
            <EditCalibrationModal />
            <RemoveInstallationModal />
            <DeviceInstallationErrorHandler />
        </DeviceSelectProvider>
    )
}
export default DeviceInstallation