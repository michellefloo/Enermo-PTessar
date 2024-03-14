import React from "react";
import {
    CAlert,
    CButton
} from '@coreui/react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const EmptyObjectErrorHandler = () => {
    const history = useHistory()
    const theObjectNotFound = useSelector(state => state.coreUiState.theObjectNotFound)
    const objectNoFoundDataLink = useSelector(state => state.coreUiState.objectNoFoundDataLink)
    return (
        <CAlert color="warning">
            No {theObjectNotFound} data found!
            <CButton className="btn btn-link"
                onClick={() => {
                    history.push({
                        pathname: objectNoFoundDataLink,
                    })
                }}> 
                Go To Section
            </CButton> 
        </CAlert>
    )
}

export default EmptyObjectErrorHandler