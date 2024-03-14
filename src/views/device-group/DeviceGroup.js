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
import DeviceGroupErrorHandler from './_content/ErrorHandler'
import DeviceSelectProvider  from './_provider/GroupSelectProvider'
import {
    DeviceGroupAddModal,
    EditDeviceGroupModal,
    RemoveGroupModal
} from './_content/modals'
const DeviceGroup = () => {
    return(
        <DeviceSelectProvider>
            <CRow>
                <CCol>
                    <HeaderWidget />
                </CCol>
                <CCol>
                    <ActionButtonsContainer />
                </CCol>
            </CRow>
            <CRow>
                <CCol>
                    <FilterContainer />
                </CCol>
            </CRow>
            <CCard>
                <CCardHeader>
                    <strong>Device Group List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <DeviceGroupAddModal />
            <EditDeviceGroupModal />
            <RemoveGroupModal />
            <DeviceGroupErrorHandler />
        </DeviceSelectProvider>
    )
}
export default DeviceGroup