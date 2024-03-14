import React, { useContext, useEffect } from "react";
import Select from 'react-select'
import { GroupSelectContext } from '../_provider/GroupSelectProvider'
import { useGetDeviceGroupSelectList } from '../../../api/device-group'
import { useLocation } from "react-router-dom";

const GroupFilterContainer = () => {
    const location = useLocation()
    const { selectedGroup, setSelectedGroupName, 
            setSelectedGroup, setSelectedGroupDesc
    } = useContext(GroupSelectContext)
    const { data: deviceSelectData, status: deviceSelectStatus } = useGetDeviceGroupSelectList()
    useEffect(() => {   
        if(!location.state) return
        const {device_id, device_name} = location.state
        if(device_id){
            setSelectedGroup(device_id)
            setSelectedGroupName(device_name)
        }
    }, [location, setSelectedGroup, setSelectedGroupName])
    return(
        <Select
            isClearable
            isSearchable
            isLoading={deviceSelectStatus === 'loading'}
            name="device"
            options={deviceSelectData}
            className="mb-3"
            placeholder="Select Group"
            value={deviceSelectData? deviceSelectData.find(obj => obj.value === selectedGroup) : []}
            onChange={(e) => {
                setSelectedGroupName(!!e ? e.name : "")
                setSelectedGroup(!!e ? e.value : -1)
                setSelectedGroupDesc(!!e ? e.desc : "")
            }}
        />
    )
}

export default GroupFilterContainer