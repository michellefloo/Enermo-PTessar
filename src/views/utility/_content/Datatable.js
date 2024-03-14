import React, { Fragment, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useGetUtilityList } from '../../../api/utility'
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
import { DATE_ISO8601_NO_TIME } from 'src/utils/constant'

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

const WattageSlot = (props) => {
    const {data} = props
    return(
        <td>
            <p>
                {data.utility_wattage} W
            </p>
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

const UtilityDatatable = () => {
    const dispatch = useDispatch()
    const {data: rqData, status: rqStatus} = useGetUtilityList()
    const [utilityData, setUtilityData] = useState([])
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    const handleOnUpdateClick = async (item) => {
        item.id_location = {
            label: item.location_name,
            value: item.id_location,
        }
        item.id_utility_type = {
            label: item.utility_type_name,
            value: item.id_utility_type,
        }
        item.id_usage_schedule = {
            label: item.usage_schedule_name,
            value: item.id_usage_schedule,
        }
        item.id_resource_usage_type = {
            label: item.resource_usage_type_name,
            value: item.id_resource_usage_type,
        }
        item.id_device = {
            label: item.device_name,
            value: item.id_device,
        }
        item.fabrication_date = moment(item.fabrication_date).format(DATE_ISO8601_NO_TIME)
        item.installation_date = moment(item.installation_date).format(DATE_ISO8601_NO_TIME)
        delete item.location_name
        delete item.utility_type_name
        delete item.usage_schedule_name
        delete item.resource_usage_type_name
        delete item.device_name
        delete item.created_on
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'editUtilityModal',
            initialValues: item
        })     
    }
    const handleOnDeleteClick = async (item) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'deleteUtilityModal',
            initialValues: item
        })     
    }
    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setUtilityData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setUtilityData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'location_name', label: 'Boundary', _style: { width: '15%'}},
        { key: 'utility_name', label: "Name", _style: { width: '15%'}},
        { key: 'utility_type_name', label: "Type", _style: { width: '15%'}},
        { key: 'utility_wattage', label: "Wattage", _style: { width: '3%'}},
        { key: 'usage_schedule_name', label: "Usage", _style: { width: '5%'}},
        { key: 'resource_usage_type_name', label: "Usage Type", _style: { width: '15%'}},
        { key: 'device_name', label: "Device Code", _style: { width: '5%'}},
        { key: 'fabrication_date', label: "Fabrication Date", _style: { width: '15%'}},
        { key: 'installation_date', label: "Install Date", _style: { width: '20%'}},
        { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]   
    const scopedSlots = {
        'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect} />,
        'utility_wattage': (item) => <WattageSlot data={item} />,
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
           setUtilityData(rqData.result)
        }
    }, [rqData, rqStatus])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'location_name', label: 'Boundary'},
                    { key: 'utility_name', label: "Name"},
                    { key: 'utility_type_name', label: "Type"},
                    { key: 'utility_wattage', label: "Wattage"},
                    { key: 'usage_schedule_name', label: "Usage"},
                    { key: 'resource_usage_type_name', label: "Usage Type"},
                    { key: 'device_name', label: "Device Code"},
                    { key: 'fabrication_date', label: "Fabrication Date"},
                    { key: 'installation_date', label: "Install Date"},
                ],
                data: utilityData,
                fileName: 'Utility List'
        })
    }, [utilityData, dispatch])

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
            setUtilityData(rqData.result)
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
            setUtilityData(rqData.result)
            return
        }
        setUtilityData(items)
    }

    return (
        <Fragment>
            <CDataTable 
                items={utilityData}
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

export default UtilityDatatable