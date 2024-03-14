import React from "react";
import {
    CCard,
    CCardBody,
    CRow,
    CCol,
} from "@coreui/react";
import styles from "./cardbutton.module.scss"
import CIcon from '@coreui/icons-react'

const CardButton = ({icon, text, onClick}) => {

    return (
        <CCard className={`${styles['cardbutton']}`} onClick={onClick}>
            <CCardBody>
                <CRow>
                    <CCol xs="12" md="12" lg="12" className="mb-2">
                        <CIcon size={'6xl'} content={icon} />
                    </CCol>
                    <CCol xs="12" md="12" lg="12">
                        {text}
                    </CCol>
                </CRow>
            </CCardBody>
        </CCard>
    )

}

export default CardButton