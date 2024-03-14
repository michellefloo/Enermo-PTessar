import React from 'react'
import {
    CContainer,
    CButton,
} from '@coreui/react'
import { ExportCsvFromCoreUiDatatable } from '../../../components/export-to-csv-button'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'

const UserManagementActionButtonContainer = () => {
    const dispatch = useDispatch()
    return(
    <CContainer className="d-flex justify-content-end flex-wrap" fluid>
        <div className="p-2">
            <CButton color="info"
                onClick={() => dispatch({
                        type: 'CALL_MODAL',
                        modalName: 'addDeviceModal',
                        initialValues: {}
                    })
                }
            >
                <CIcon content={cilPlus} /> Add Device
            </CButton>
        </div>
        <div className="p-2">
            <ExportCsvFromCoreUiDatatable />
        </div>
    </CContainer>
    )
}

export default UserManagementActionButtonContainer