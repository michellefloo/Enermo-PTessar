import React, { Fragment, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useGetSensorList } from '../../../api/sensor'
import {
    CCol,
    CRow,
    CDataTable,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CInputCheckbox,
    CInput
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import moment from 'moment'
import { DATE_ISO8601_NO_TIME } from '../../../utils/constant'

const SelectionColumnSLot = (props) => {
    const {onSelected} = props
    return(
        <CInput 
            type="checkbox" 
            size="sm"
            onChange={e => {
                onSelected(e.target.checked)
            }}
        />
    )
}

const SelectionSlot = (props) => {
    const {data, onSelected} = props
    return(
        <td >
            <CInputCheckbox  
                className="mx-auto"
                checked={data._checked || false}
                onChange={e => {
                    onSelected(e.target.checked, data.id)
                }}
            />
        </td>
    )
}

const ActionButtonSlot = (props) => {
    const {onUpdateClick, onDeleteClick, data} = props
    return(
        <td>
            <CDropdown>
                <CDropdownToggle size='sm'/>
                <CDropdownMenu>
                    <CDropdownItem onClick={() => onUpdateClick(data)} >
                        <CRow>
                            <CCol>Edit</CCol>
                            <CCol className="ml-5">
                                <CIcon name={'cilPencil'} />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                    <CDropdownItem onClick={() => onDeleteClick(data)}>
                        <CRow>
                            <CCol>Delete</CCol>
                            <CCol className="ml-5">
                                <CIcon name={'cilTrash'} />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </td>
    )
}

const SensorDatatable = () => {
    const dispatch = useDispatch()
    const {data: rqData, status: rqStatus} = useGetSensorList()
    const [sensorData, setSensorData] = useState([])
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    const handleOnUpdateClick = async (item) => {
        item.id_device = {
            label: item.device_name,
            value: item.id_device,
        }
        item.id_sensor_class = {
            label: item.sensor_class,
            value: item.sensor_class_id,
        }
        item.id_sensor_type = {
            label: item.sensor_type,
            value: item.sensor_type_id,
        }
        item.id_sensor_fabricator = {
            label: item.sensor_fabricator,
            value: item.sensor_fabricator_id,
        }
        item.fabrication_date = moment(item.fabrication_date).format(DATE_ISO8601_NO_TIME)
        delete item.created_on
        delete item.device_name
        delete item.device_serial_number
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'editSensorModal',
            initialValues: item
        })     
    }
    const handleOnDeleteClick = async (item) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'deleteSensorModal',
            initialValues: item
        })
    }
    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setSensorData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setSensorData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'device_name', label: 'Device Code', _style: { width: '15%'}},
        { key: 'sensor_name', label: "Sensor Name", _style: { width: '15%'}},
        { key: 'sensor_code', label: "Sensor Code", _style: { width: '4%'}},
        { key: 'serial_number', label: "Serial Number", _style: { width: '4%'}},
        { key: 'sensor_type', label: "Type", _style: { width: '10%'}},
        { key: 'sensor_class', label: "Class", _style: { width: '15%'}},
        { key: 'max_measurement_cap', label: " Max Cap", _style: { width: '10%'}},
        { key: 'sensor_fabricator', label: "Fabricator", _style: { width: '20%'}},
        { key: 'fabrication_date', label: "Fabrication Date", _style: { width: '15%'}},
        { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]   
    const scopedSlots = {
        'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect} />,
        'action': (item) => <ActionButtonSlot data={item}
                                onUpdateClick={handleOnUpdateClick}
                                onDeleteClick={handleOnDeleteClick}
                            />
    }
    const columnFilterSlot = {
        'selection': <SelectionColumnSLot onSelected={handleSelectAll}/>,
    }

    useEffect(() => {
        if(rqStatus === 'success'){
           if(!rqData) return
           if(!rqData.result) return
           setSensorData(rqData.result)
        }
    }, [rqData, rqStatus])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'device_name', label: 'Device Code'},
                    { key: 'sensor_name', label: "Sensor Name"},
                    { key: 'sensor_code', label: "Sensor Code"},
                    { key: 'serial_number', label: "Serial Number"},
                    { key: 'sensor_type', label: "Type"},
                    { key: 'sensor_class', label: "Class"},
                    { key: 'max_measurement_cap', label: " Max Cap"},
                    { key: 'sensor_fabricator', label: "Fabricator"},
                    { key: 'fabrication_date', label: "Fabrication Date"},
                ],
                data: sensorData,
                fileName: 'Sensor List'
        })
    }, [sensorData, dispatch])

    const handleColumnFilterChange = (e) => {
        if(rqStatus !== 'success'){
            return
        }
        let isFilterEmpty =  true
        const eKeys = Object.keys(e)
        for(let i = 0; i < eKeys.length; i++){
            if(e[eKeys[i]].length > 0){
                isFilterEmpty = false
                break
            }
        }
        if(isFilterEmpty){
            setSensorData(rqData.result)
        }
        if(isSelecAllSelected){
            handleSelectAll(true)
        }
    }

    const handleOnFilteredItemsChange = (items) => {
        if(rqStatus !== 'success'){
            return
        }
        if(items.length === 0){
            setSensorData(rqData.result)
            return
        }
        setSensorData(items)
    }

    return (
        <Fragment>
            <CDataTable 
                items={sensorData}
                striped
                responsive
                fields={fields}
                columnFilterSlot={columnFilterSlot}
                scopedSlots={scopedSlots}
                columnFilter
                itemsPerPage={15}
                loading={rqStatus === 'loading'}
                onColumnFilterChange={(e) => handleColumnFilterChange(e)}
                onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
                hover
                sorter
                pagination
            />
        </Fragment>
    )
}

export default SensorDatatable