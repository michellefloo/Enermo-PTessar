import React, { Fragment, useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useGetBoundaryList } from '../../../api/boundary'
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
// import { addCDatatableRowClasses, removeLastCDatatableRowClasses } from '../../../utils/helpers'

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

const LocationHeightSlot = (props) => {
    const {data} = props
    return(
        <td>
            <p>
                {data.location_height} m
            </p>
        </td>
    )
}

const LocationSquareMeterSlot = (props) => {
    const {data} = props
    return(
        <td>
            <p>
                {data.location_square_meter} m<sup>2</sup>
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

const BoundaryDatatable = () => {
    const dispatch = useDispatch()
    const {data: rqData, status: rqStatus} = useGetBoundaryList({withBoundary:true})
    const [boundaryData, setBoundaryData] = useState([])
    // const [selectedRowItem, setSelectedRowItem] = useState({})
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    const handleOnUpdateClick = async (item) => {
        // await removeLastCDatatableRowClasses(selectedRowItem)
        // await addCDatatableRowClasses(item, "table-warning")
        // setSelectedRowItem(item)
        item.idParents = {
            label: item.idParents === -1? "None" : item.parents,
            value: item.idParents
        }
        item.id_location_type = {
            label: item.location_type,
            value: item.id_location_type
        }
        item.id_main_customer = {
            label: item.customer? item.customer.name : "None",
            value: item.customer? item.customer.id : -1
        }
        delete item.created_on
        delete item.floor_plan_image_link
        delete item.childs
        delete item.id_company
        delete item.location_type
        delete item.parents
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'editBoundaryModal',
            initialValues: item
        })
    }
    const handleOnDeleteClick = async (item) => {
        // await removeLastCDatatableRowClasses(selectedRowItem)
        // await addCDatatableRowClasses(item, "table-danger")
        // setSelectedRowItem(item)
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'deleteBoundaryModal',
            initialValues: item
        })
    }
    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setBoundaryData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setBoundaryData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'location_code', label: 'Code', _style: { width: '15%'}},
        { key: 'location_name', label: "Name", _style: { width: '15%'}},
        { key: 'customer_name', label: "Customer", _style: { width: '15%'}},
        { key: 'parents', label: "Parent", _style: { width: '15%'}},
        { key: 'location_type', label: "Type", _style: { width: '15%'}},
        { key: 'location_desc', label: "Desc.", _style: { width: '20%'}},
        { key: 'location_height', label: "Height", _style: { width: '5%'}},
        { key: 'location_square_meter', label: "Wide", _style: { width: '8%'}},
        { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]   
    const scopedSlots = {
        'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect} />,
        'location_height': (item) => <LocationHeightSlot data={item} />,
        'location_square_meter': (item) => <LocationSquareMeterSlot data={item} />,
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
           if(!rqData.transformed) return
           setBoundaryData(rqData.transformed)
        }
    }, [rqData, rqStatus])

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'location_code', label: 'Code'},
                    { key: 'location_name', label: "Name"},
                    { key: 'customer_name', label: "Customer"},
                    { key: 'parents', label: "Parent"},
                    { key: 'location_type', label: "Type"},
                    { key: 'location_desc', label: "Desc."},
                    { key: 'location_height', label: "Height"},
                    { key: 'location_square_meter', label: "Wide"},
                ],
                data: boundaryData,
                fileName: 'Boundary List'
        })
    }, [boundaryData, dispatch])

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
            setBoundaryData(rqData.transformed)
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
            setBoundaryData(rqData.transformed)
            return
        }
        setBoundaryData(items)
    }

    return (
        <Fragment>
            <CDataTable 
                items={boundaryData}
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

export default BoundaryDatatable