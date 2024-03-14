import React, { useState, useEffect, Fragment } from 'react'
import { useGetUserManagementList } from '../../../api/user-management'
import {
    CCol,
    CRow,
    CDataTable,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CInputCheckbox,
    CInput,
    CBadge,
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked,
        cilDoor, cilShare } from '@coreui/icons'
import { useDispatch } from 'react-redux'

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

const EmailSlot = (props) => {
    const {data} = props
    return(
        <td>
            <span>{data.email}</span>&nbsp;
            {data.verified === 0 && 
                <CBadge color="danger"> unverified</CBadge>
            }
            {data.verified === 1 && 
                <CBadge color="success"> verified</CBadge>
            }
            {data.status === 4 &&
                <>&nbsp;<CBadge color="danger"> locked</CBadge></>
            }
        </td>
    )
}

const ActionButtonSlot = (props) => {
    const { data, onLockUserClick,
            onResetPasswordClick, onDeleteAccountClick,
            onResendEmailClick
        } = props
    return(
        <td>
            <CDropdown>
                <CDropdownToggle size='sm'/>
                <CDropdownMenu>
                    <CDropdownItem onClick={() => onLockUserClick(data)} >
                        <CRow>
                            <CCol>{data.status === 1? "Lock" : "Unlock"}</CCol>
                            <CCol className="ml-5">
                                <CIcon content={data.status === 1? cilLockLocked : cilLockUnlocked} />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                    <CDropdownItem onClick={() => onResetPasswordClick(data)}>
                        <CRow>
                            <CCol>Reset Password</CCol>
                            <CCol className="ml-5">
                                <CIcon content={cilDoor} />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                    <CDropdownItem onClick={() => onResendEmailClick(data)}>
                        <CRow>
                        <CCol>Resend Email</CCol>                            
                        <CCol className="ml-5">
                                &nbsp;&nbsp;<CIcon content={cilShare} />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                    <CDropdownItem onClick={() => onDeleteAccountClick(data)}>
                        <CRow>
                        <CCol>Delete Account</CCol>                            
                        <CCol className="ml-5">
                                &nbsp;&nbsp;<CIcon name={'cilTrash'}  />
                            </CCol>
                        </CRow>
                    </CDropdownItem>
                </CDropdownMenu>
            </CDropdown>
        </td>
    )
}

const UserManagementDataTable = () => {
    const dispatch = useDispatch()
    const {data: rqData, status: rqStatus} = useGetUserManagementList()
    const [userManagementData, setUserManagementData] = useState([])
    const [isSelecAllSelected, setSelecAllSelected] = useState(false)

    useEffect(() => {
        if(rqStatus === 'success'){
            if(!rqData) return
            setUserManagementData(rqData)
        }
    }, [rqData, rqStatus])

    const handleOnLockUserClick = (data) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'lockUserModal',
            initialValues: data
        })
    }

    const handleOnResetPasswordClick = (data) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'resetPasswordModal',
            initialValues: data
        })
    }

    const handleOnDeleteAccountClick = (data) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'deleteAccountModal',
            initialValues: data
        })
    }

    const handleOnResendEmailClick = (data) => {
        dispatch({
            type: 'CALL_MODAL',
            modalName: 'resendEmailModal',
            initialValues: data
        })
    }

    const handleSelectAll = (isSelected) => {
        setSelecAllSelected(isSelected)
        setUserManagementData(currentData => {
            return currentData.map(
                d => ({...d, _checked: isSelected})
            )
        })
    }
    const handleSelect = (isSelected, selectedId) => {
        setUserManagementData(currentData => {
            const findIndex = currentData.findIndex(d => d.id === selectedId)
            currentData[findIndex]._checked = isSelected
            return [...currentData]
        })
    }

    const fields = [
        { key: 'selection', label: '', filter:false , _style: { width: '2%'}},
        { key: 'email', label: "Email", _style: { width: '20%'}},
        { key: 'first_name', label: "First Name", _style: { width: '15%'}},
        { key: 'last_name', label: "Last Name", _style: { width: '15%'}},
        { key: 'user_level', label: "User Level", _style: { width: '15%'}},
        { key: 'action', label:"Action", filter:false , _style: { width: '10%'}},
    ]
    
    const scopedSlots = {
        'selection': (item) => <SelectionSlot data={item} onSelected={handleSelect} />,
        'email': (item) => <EmailSlot data={item} />,
        'action': (item) => <ActionButtonSlot data={item}
                                onLockUserClick={handleOnLockUserClick}
                                onResetPasswordClick={handleOnResetPasswordClick}
                                onDeleteAccountClick={handleOnDeleteAccountClick}
                                onResendEmailClick={handleOnResendEmailClick}
                            />
    }
    const columnFilterSlot = {
        'selection': <SelectionColumnSLot onSelected={handleSelectAll}/>,
    }

    useEffect(() => {
        dispatch({type: 'exportFromCoreUIDataTable', 
                fields: [
                    { key: 'email', label: "Email"},
                    { key: 'first_name', label: "First Name"},
                    { key: 'last_name', label: "Last Name"},
                    { key: 'user_level', label: "User Level"},
                ],
                data: userManagementData,
                fileName: 'User Management List'
        })
    }, [userManagementData, dispatch])

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
            setUserManagementData(rqData)
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
            setUserManagementData(rqData)
            return
        }
        setUserManagementData(items)
    }

    return (
        <Fragment>
            <CDataTable 
                items={userManagementData}
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

export default UserManagementDataTable