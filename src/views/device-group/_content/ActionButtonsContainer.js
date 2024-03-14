import React from 'react'
import {
    CContainer,
    CButton
} from '@coreui/react'
import { ExportCsvFromCoreUiDatatable } from '../../../components/export-to-csv-button'
import { cilPlus, cilPencil, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { GroupSelectContext } from '../_provider/GroupSelectProvider'
// import { useGetGroupInstallByIddGroupList } from '../../../api/device-installation'

const GroupInstallationActionButtonContainer = () => {
    const dispatch = useDispatch()
    const { selectedGroup, selectedGroupName, selectedGroupDesc} = React.useContext(GroupSelectContext)
    return(
    <CContainer className="d-flex justify-content-end flex-wrap" fluid>
        <div className="p-2">
            <CButton color="info"
                onClick={() => dispatch({
                        type: 'CALL_MODAL',
                        modalName: 'addGroupModal',
                        // initialValues: {id_device: selectedGroup, device_name:selectedGroupName}
                    })
                }
            >
                <CIcon content={cilPlus} /> Add Group
            </CButton>
        </div>
        <div className='p-2'>
            <CButton color="warning"
                disabled={(selectedGroup === -1)}
                onClick={() => dispatch({
                        type: 'CALL_MODAL',
                        modalName: 'editGroupModal',
                        initialValues: {
                            id_group: selectedGroup, 
                            group_name:selectedGroupName,
                            group_description:selectedGroupDesc
                        }
                    })
                }
            >
                <CIcon content={cilPencil} /> Edit Group
            </CButton>
        </div>
        <div className='p-2'>
            <CButton color="danger"
                disabled={(selectedGroup === -1)}
                onClick={() => dispatch({
                        type: 'CALL_MODAL',
                        modalName: 'deleteGroupModal',
                        initialValues: {
                            id_group: selectedGroup, 
                            group_name:selectedGroupName,
                            descriptions:selectedGroupDesc
                        }
                    })
                }
            >
                <CIcon content={cilTrash} /> Delete Group
            </CButton>
        </div>
        <div className="p-2">
            <ExportCsvFromCoreUiDatatable />
        </div>
    </CContainer>
    )
}

export default GroupInstallationActionButtonContainer