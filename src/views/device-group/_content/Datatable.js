import React, { Fragment, useState, useEffect, useContext} from 'react'
import { useDispatch } from 'react-redux'
import { useGetDeviceGroupDetailListByIdGroup } from '../../../api/device-group-detail'
import { useGetDeviceList } from '../../../api/device'
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
import { GroupSelectContext } from '../_provider/GroupSelectProvider'

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

const GroupInstallationDatatable = () => {
    const dispatch = useDispatch()
    const {selectedGroup, selectedGroupName, setIsNeedToLoading, setDeviceUponShow} = useContext(GroupSelectContext)
    const {data: rqData, status: rqStatus} = useGetDeviceGroupDetailListByIdGroup(selectedGroup)
    const {data: deviceData, status: deviceStatus} = useGetDeviceList()

    const [deviceDataPerGroup, setDeviceDataPerGroup] = useState([])
    // const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    // const handleOnUpdateClick = async (item) => {
    //     item.id_device = selectedGroup
    //     item.device_name = selectedGroupName
    //     item.curr_calibration_date_expiry = item.calibration_date_expiry
    //     dispatch({
    //         type: 'CALL_MODAL',
    //         modalName: 'editGroupModal',
    //         initialValues: item
    //     })
    // }
    // const handleOnDeleteClick = async (item) => {
    //     item.device_name = selectedGroupName
    //     dispatch({
    //         type: 'CALL_MODAL',
    //         modalName: 'removeGroupModal',
    //         initialValues: item
    //     })
    // }
    // const handleSelectAll = (isSelected) => {
    //     setSelecAllSelected(isSelected)
    //     setDeviceDataPerGroup(currentData => {
    //         return currentData.map(
    //             d => ({...d, _checked: isSelected})
    //         )
    //     })
    // }
    // const handleSelect = (isSelected, selectedId) => {
    //     setDeviceDataPerGroup(currentData => {
    //         const findIndex = currentData.findIndex(d => d.id === selectedId)
    //         currentData[findIndex]._checked = isSelected
    //         return [...currentData]
    //     })
    // }

    const fields = [
        // { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'device_desc', label: "Device Name", _style: { width: '15%'}},
        { key: 'device_name', label: "Device Code", _style: { width: '15%'}},
        { key: 'serial_number', label: "Serial Number", _style: { width: '15%'}},
        { key: 'fabricator_name', label: "Fabricator", _style: { width: '15%'}},
        // { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]   
    const scopedSlots = {
        // 'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect}/>,
        // 'action': (item) => <ActionButtonSlot data={item}
        //                         onUpdateClick={handleOnUpdateClick}
        //                         onDeleteClick={handleOnDeleteClick}
        //                     />
    }
    const columnFilterSlot = {
        // 'selection': <SelectionColumnSLot onSelected={handleSelectAll}/>,
    }

    useEffect(() => {
        if(rqStatus === 'loading' || deviceStatus === 'loading'){
            setIsNeedToLoading(true)
        }
        if(rqStatus === 'success' && deviceStatus === 'success'){
           if(!rqData.result) return
           if(!deviceData.result) return
           const deviceDataArr = []
           rqData.result.map(item1 => {
            const matchingItem = deviceData.result.find(item2 => item2.id === item1.id_devices);
            if (matchingItem) {
                matchingItem._checked = true
                deviceDataArr.push(matchingItem)
            }
            return
          });
          setDeviceUponShow(deviceDataArr)
          setDeviceDataPerGroup(deviceDataArr)
          setIsNeedToLoading(false)
        }
    }, [rqData, rqStatus, deviceStatus, deviceData, setIsNeedToLoading, selectedGroup])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'device_desc', label: "Device Name"},
                    { key: 'device_name', label: "Device Code"},
                    { key: 'serial_number', label: "Serial Number"},
                    { key: 'fabricator_name', label: "Fabricator"},
                ],
                data: deviceDataPerGroup,
                fileName: `Group ${selectedGroupName} Device List`
        })
    }, [deviceDataPerGroup, dispatch])
    
    // const handleColumnFilterChange = (e) => {
    //     if(rqStatus !== 'success'){
    //         return
    //     }
    //     let isFilterEmpty =  true
    //     const eKeys = Object.keys(e)
    //     for(let i = 0; i < eKeys.length; i++){
    //         if(e[eKeys[i]].length > 0){
    //             isFilterEmpty = false
    //             break
    //         }
    //     }
    //     if(isFilterEmpty){
    //         setGroupInstallationData(rqData.result)
    //     }
    //     if(isSelecAllSelected){
    //         handleSelectAll(true)
    //     }
    // }

    // const handleOnFilteredItemsChange = (items) => {
    //     if(rqStatus !== 'success'){
    //         return
    //     }
    //     if(items.length === 0){
    //         setGroupInstallationData(rqData.result)
    //         return
    //     }
    //     setGroupInstallationData(items)
    // }

    return (
        <Fragment>
            <CDataTable 
                items={deviceDataPerGroup}
                striped
                responsive
                fields={fields}
                // columnFilterSlot={[]}
                // scopedSlots={[]}
                // columnFilter
                itemsPerPage={15}
                // loading={rqStatus === 'loading'}
                // onColumnFilterChange={(e) => handleColumnFilterChange(e)}
                // onFilteredItemsChange={(i) => handleOnFilteredItemsChange(i)}
                hover
                sorter
                pagination
            />
        </Fragment>
    )
}

export default GroupInstallationDatatable