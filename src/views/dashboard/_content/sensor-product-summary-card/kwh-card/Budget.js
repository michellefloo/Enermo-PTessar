import React, { Fragment } from "react";
import { useGetBudgetList } from "src/api/setting";
import {
    CCol,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
import moment from "moment";
import { cilNotes } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const BudgetCard = () => {
    const { data, status } = useGetBudgetList();
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
        <CWidgetIcon text="Budget kWh This Month"
            color="primary" iconPadding={false}
             header={String(data[moment().format("MYYYY")]).toLocaleString()}>
            <CIcon width={24} content={cilNotes} />
        </CWidgetIcon>
    );

}
export default BudgetCard;
