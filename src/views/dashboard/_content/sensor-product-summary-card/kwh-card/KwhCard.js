import React, { Fragment } from "react";
import {
    CCol,
    CRow,
} from '@coreui/react'
import ThisMonthTotalKwh from "./ThisMonthTotalKwh";
import RealKwhThisMonth from "./RealKwhThisMonth";
import BudgetCard from "./Budget";
import RunrateThisMonth from "./RunrateThisMonth";

const KwhCard = () => {
    return (
        <Fragment>
            <CRow>
                <CCol xs="3" sm="3" lg="3">
                    <ThisMonthTotalKwh />
                </CCol>
                <CCol xs="3" sm="3" lg="3">
                    <RealKwhThisMonth />
                </CCol>
                <CCol xs="3" sm="3" lg="3">
                    <BudgetCard />
                </CCol>
            </CRow>
            <CRow>
            <CCol xs="3" sm="3" lg="3">
                <RunrateThisMonth />
            </CCol>
        </CRow>
       </Fragment>
    );
}

export default KwhCard;