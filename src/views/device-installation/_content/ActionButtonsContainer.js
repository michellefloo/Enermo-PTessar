import React from 'react'
import {
    CContainer,
    CButton
} from '@coreui/react'
import { ExportCsvFromCoreUiDatatable } from '../../../components/export-to-csv-button'
import { cilPlus } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch } from 'react-redux'
import { DeviceSelectContext } from '../_provider/DeviceSelectProvider'
import { useGetDeviceInstallByIddDeviceList } from '../../../api/device-installation'

const DeviceInstallationActionButtonContainer = () => {
    const dispatch = useDispatch()
    const { selectedDevice, selectedDeviceName } = React.useContext(DeviceSelectContext)
    const {data: rqData} = useGetDeviceInstallByIddDeviceList(selectedDevice)
    const isAbleAddDeviceInstallation = () => {
        if(!rqData) return false
        if(!rqData.result) return false
        if(rqData.result.length === 0) return true
        const lastItem = rqData.result[rqData.result.length - 1]
        return lastItem.removal_date !== ''
    }
    return(
    <CContainer className="d-flex justify-content-end flex-wrap" fluid>
        <div className="p-2">
            <CButton color="info"
                disabled={(selectedDevice === -1) || !isAbleAddDeviceInstallation()}
                onClick={() => dispatch({
                        type: 'CALL_MODAL',
                        modalName: 'addDeviceInstallationModal',
                        initialValues: {id_device: selectedDevice, device_name:selectedDeviceName}
                    })
                }
            >
                <CIcon content={cilPlus} /> Add Installation
            </CButton>
        </div>
        <div className="p-2">
            <ExportCsvFromCoreUiDatatable />
        </div>
    </CContainer>
    )
}

export default DeviceInstallationActionButtonContainer