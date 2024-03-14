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
import UtilityErrorHandler from './_content/ErrorHandler'
import {
    UtilityAddModal,
    UtilityEditModal,
    UtilityDeleteModal
} from './_content/modals'
const Utility = () => {
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
                    <strong>Utility List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <UtilityAddModal />
            <UtilityEditModal />
            <UtilityDeleteModal />
            <UtilityErrorHandler />
        </Fragment>
    )
}
export default Utility