import React, { Fragment } from "react";
import {
    CCol,
    CRow,
} from '@coreui/react'
import {
    MyAccount,
    MyCompany,
    Parameters,
    Budget
} from "./_content";
import {
    MyAccountModal,
    MyCompanyModal,
    ParameterModal,
    BudgetModal
} from "./_content/modals";

const Settings = () => {

    return (
        <Fragment>
            <CRow>
                <CCol xs="6" md="6" lg="6">
                    <MyAccount />
                </CCol>
                <CCol xs="6" md="6" lg="6">
                    <MyCompany />
                </CCol>
                <CCol xs="6" md="6" lg="6">
                    <Budget />
                </CCol>
                <CCol xs="6" md="6" lg="6">
                    <Parameters />
                </CCol>
            </CRow>
            <MyAccountModal />
            <MyCompanyModal />
            <ParameterModal />
            <BudgetModal />
        </Fragment>
    )

}

export default Settings