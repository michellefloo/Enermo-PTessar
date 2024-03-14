import React from "react";
import {
    CAlert,
    CButton
} from '@coreui/react'

const ConnectionErrorHandler = () => {
    return (
        <CAlert color="warning">
            We are sorry for the inconvinient, please check your network connection
            or  try to 
            <CButton className="btn btn-link"
                     onClick={() => window.location.reload()}> 
                reload page
            </CButton> 
        </CAlert>
    )
}

export default ConnectionErrorHandler