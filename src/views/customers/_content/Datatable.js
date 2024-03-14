import React, { Fragment, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useGetCustomerList } from '../../../api/customer'
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

const CustomerDatatable = () => {
    const dispatch = useDispatch()
    const {data: rqData, status: rqStatus} = useGetCustomerList()
    const [sensorData, setCustomerData] = useState([])
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    const handleOnUpdateClick = async (item) => {
        console.log(item)
        item.desc = item.description
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'editCustomerModal',
            initialValues: item
        })
    }
    const handleOnDeleteClick = async (item) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'deleteCustomerModal',
            initialValues: item
        })
    }
    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setCustomerData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setCustomerData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'name', label: 'Name', _style: { width: '15%'}},
        { key: 'main_address', label: "Address", _style: { width: '4%'}},
        { key: 'lat', label: "Latitude", _style: { width: '4%'}},
        { key: 'lng', label: "Longitude", _style: { width: '10%'}},
        { key: 'email', label: "Email", _style: { width: '15%'}},
        { key: 'handphone', label: "Whatsapp", _style: { width: '15%'}},
        { key: 'phone', label: "Phone", _style: { width: '15%'}},
        { key: 'action', label: "Action", filter:false , _style: { width: '10%'}},
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
            if(!rqData)return
            if(!rqData.result)return
           setCustomerData(rqData.result)
        }
    }, [rqData, rqStatus])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'name', label: 'Name'},
                    { key: 'main_address', label: "Address"},
                    { key: 'lat', label: "Latitude"},
                    { key: 'lng', label: "Longitude"},
                    { key: 'email', label: "Email"},
                    { key: 'handphone', label: "Whatsapp"},
                    { key: 'phone', label: "Phone"},
                ],
                data: sensorData,
                fileName: 'Customer List'
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
            setCustomerData(rqData.result)
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
            setCustomerData(rqData.result)
            return
        }
        setCustomerData(items)
    }

    return (
        <Fragment>
            <CDataTable 
                items={sensorData}
                responsive
                fields={fields}
                columnFilterSlot={columnFilterSlot}
                scopedSlots={scopedSlots}
                columnFilter
                striped
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

export default CustomerDatatable