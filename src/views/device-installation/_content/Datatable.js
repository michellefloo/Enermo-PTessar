import React, { Fragment, useState, useEffect, useContext} from 'react'
import { useDispatch } from 'react-redux'
import { useGetDeviceInstallByIddDeviceList } from '../../../api/device-installation'
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
import { DeviceSelectContext } from '../_provider/DeviceSelectProvider'

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
    if(!data._last) return <></>
    return(
        <td>
            <CDropdown>
                <CDropdownToggle size='sm'/>
                <CDropdownMenu>
                    <CDropdownItem onClick={() => onUpdateClick(data)} >
                        <CRow>
                            <CCol>Update Calibration</CCol>
                        </CRow>
                    </CDropdownItem>
                    <CDropdownItem onClick={() => onDeleteClick(data)}>
                        <CRow>
                            <CCol>Remove Installation</CCol>
                        </CRow>
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </td>
    )
}

const DeviceInstallationDatatable = () => {
    const dispatch = useDispatch()
    const {selectedDevice, selectedDeviceName, setIsNeedToLoading} = useContext(DeviceSelectContext)
    const {data: rqData, status: rqStatus} = useGetDeviceInstallByIddDeviceList(selectedDevice)
    const [sensorData, setDeviceInstallationData] = useState([])
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    const handleOnUpdateClick = async (item) => {
        item.id_device = selectedDevice
        item.device_name = selectedDeviceName
        item.curr_calibration_date_expiry = item.calibration_date_expiry
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'editCalibrationModal',
            initialValues: item
        })
    }
    const handleOnDeleteClick = async (item) => {
        item.device_name = selectedDeviceName
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'removeInstallationModal',
            initialValues: item
        })
    }
    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setDeviceInstallationData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setDeviceInstallationData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'location_name', label: 'Location Name', _style: { width: '15%'}},
        { key: 'installation_date', label: "Installed On", _style: { width: '15%'}},
        { key: 'installation_order_number', label: "Installation Code", _style: { width: '15%'}},
        { key: 'installed_by', label: "Installator", _style: { width: '15%'}},
        { key: 'calibration_date_expiry', label: "Calibration Expiry", _style: { width: '15%'}},
        { key: 'removal_date', label: "Removal Date", _style: { width: '15%'}},
        { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]   
    const scopedSlots = {
        'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect}/>,
        'action': (item) => <ActionButtonSlot data={item}
                                onUpdateClick={handleOnUpdateClick}
                                onDeleteClick={handleOnDeleteClick}
                            />
    }
    const columnFilterSlot = {
        'selection': <SelectionColumnSLot onSelected={handleSelectAll}/>,
    }

    useEffect(() => {
        if(rqStatus === 'loading'){
            setIsNeedToLoading(true)
        }
        if(rqStatus === 'success'){
           if(!rqData.result) return
           setDeviceInstallationData(rqData.result)
           setIsNeedToLoading(false)
        }
    }, [rqData, rqStatus, setIsNeedToLoading])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'location_name', label: 'Location Name'},
                    { key: 'installation_date', label: "Installed On"},
                    { key: 'installation_order_number', label: "Installation Code"},
                    { key: 'installed_by', label: "Installator"},
                    { key: 'calibration_date_expiry', label: "Calibration Expiry"},
                    { key: 'removal_date', label: "Removal Date"},
                ],
                data: sensorData,
                fileName: 'Device Installation List'
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
            setDeviceInstallationData(rqData.result)
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
            setDeviceInstallationData(rqData.result)
            return
        }
        setDeviceInstallationData(items)
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

export default DeviceInstallationDatatable