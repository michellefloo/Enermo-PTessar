import React, { Fragment } from 'react'
import {
    CCol,
    CRow,
    CCard,
    CCardHeader,
    CCardBody,
} from '@coreui/react'
import HeaderWidget from './_content/HeaderWidget'
import ActionButtonsContainer from './_content/ActionButtonsContainer'
import Datatable from './_content/Datatable'
import BoundaryErrorHandler from './_content/ErrorHandler'
import {
    BoundaryAddModal,
    BoundaryEditModal,
    BoundaryDeleteModal
} from './_content/modals'

const Boundary = () => {
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
                    <strong>Boundary List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <BoundaryAddModal />
            <BoundaryEditModal />
            <BoundaryDeleteModal />
            <BoundaryErrorHandler />
        </Fragment>
    )
}
export default Boundary