import React, { Fragment } from "react";
import {
    CCol,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
import moment from "moment";
import { cilDollar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const RunrateThisMonth = () => {


    const countEstimation = (realKwh) => {
        const todaysDate = Number(moment().format('DD'))
        const lastDateofMonth = Number(moment().endOf('month').format('DD'))
        return (realKwh/todaysDate) * lastDateofMonth
    }

    if(status !== "success"){
        return (
            <Fragment>
                <br/>
                <CCol xs="12" sm="6" lg="4">
                    <CSpinner className="spinner spinner--spacer-bottom"
                        color="primary" variant="grow"
                    />
                </CCol>
            </Fragment>
        )
    }
    return (
        <CWidgetIcon text="Runrate This Month"
            color="success" iconPadding={false}
             header={countEstimation().toLocaleString()}>
            <CIcon width={24} content={cilDollar} />
        </CWidgetIcon>
    );

}
export default RunrateThisMonth;
