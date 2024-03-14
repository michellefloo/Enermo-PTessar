import React, { Fragment, useState, useEffect} from 'react'
import { useGetDeviceInstallByIddDeviceList } from 'src/api/device-installation'
import {
    CDataTable,
  } from '@coreui/react'

const DeviceInstallationDatatable = ({idDevice}) => {
    const {data: rqData, status: rqStatus} = useGetDeviceInstallByIddDeviceList(idDevice)
    const [sensorData, setDeviceInstallationData] = useState([])

    const fields = [
        { key: 'location_name', label: 'Location Name', _style: { width: '15%'}},
        { key: 'installation_date', label: "Installed On", _style: { width: '15%'}},
        { key: 'installation_order_number', label: "Installation Code", _style: { width: '15%'}},
        { key: 'installed_by', label: "Installator", _style: { width: '15%'}},
        { key: 'calibration_date_expiry', label: "Calibration Expiry", _style: { width: '15%'}},
    ]   

    useEffect(() => {
        if(rqStatus === 'success'){
           setDeviceInstallationData(rqData.result)
        }
    }, [rqData, rqStatus])

    return (
        <Fragment>
            <CDataTable 
                items={sensorData}
                striped
                responsive
                fields={fields}
                columnFilter
                itemsPerPage={15}
                loading={rqStatus === 'loading'}
                hover
                sorter
                pagination
            />
        </Fragment>
    )
}

export default DeviceInstallationDatatable