import React, { Fragment, useState, useEffect} from 'react'
import { useGetSensorByIddDeviceList } from '../../../../api/sensor'
import {
    CDataTable,
} from '@coreui/react'

const SensorDatatableDetail = ({idDevice}) => {
    const {data: rqData, status: rqStatus} = useGetSensorByIddDeviceList(idDevice)
    const [sensorData, setSensorData] = useState([])

    const fields = [
        { key: 'sensor_name', label: "Sensor Name", _style: { width: '15%'}},
        { key: 'sensor_code', label: "Sensor Code", _style: { width: '4%'}},
        { key: 'serial_number', label: "Serial Number", _style: { width: '4%'}},
        { key: 'sensor_type', label: "Type", _style: { width: '10%'}},
        { key: 'sensor_class', label: "Class", _style: { width: '15%'}},
        { key: 'max_measurement_cap', label: " Max Cap", _style: { width: '10%'}},
        { key: 'sensor_fabricator', label: "Fabricator", _style: { width: '20%'}},
        { key: 'fabrication_date', label: "Fabrication Date", _style: { width: '15%'}},
    ]   

    useEffect(() => {
        if(rqStatus === 'success'){
           setSensorData(rqData.result)
        }
    }, [rqData, rqStatus])

    return (
        <Fragment>
            <CDataTable 
                items={sensorData}
                responsive
                fields={fields}
                itemsPerPage={15}
                loading={rqStatus === 'loading'}
                hover
                sorter
                pagination
            />
        </Fragment>
    )
}

export default SensorDatatableDetail