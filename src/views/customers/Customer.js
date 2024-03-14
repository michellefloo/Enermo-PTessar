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
import CustomerErrorHandler from './_content/CustomerErrorHandler'
import {
    CustomerAddModal,
    CustomerEditModal,
    CustomerDeleteModal
} from './_content/modals'
const Customer = () => {
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
                    <strong>Customer List</strong>
                </CCardHeader>
                <CCardBody>
                    <Datatable />
                </CCardBody>
            </CCard>
            <CustomerAddModal />
            <CustomerEditModal />
            <CustomerDeleteModal />
            <CustomerErrorHandler />
        </Fragment>
    )
}
export default Customer