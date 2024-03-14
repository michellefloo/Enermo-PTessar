import React, { useContext, useEffect } from "react";
import Select from 'react-select'
import { DeviceSelectContext } from '../_provider/DeviceSelectProvider'
import { useGetDeviceSelectList } from '../../../api/device'
import { useLocation } from "react-router-dom";

const DeviceFilterContainer = () => {
    const location = useLocation()
    const { selectedDevice, setSelectedDeviceName, 
        setSelectedDevice, isNeedToLoading } = useContext(DeviceSelectContext)
    const { data: deviceSelectData, status: deviceSelectStatus } = useGetDeviceSelectList()
    useEffect(() => {   
        if(!location.state) return
        const {device_id, device_name} = location.state
        if(device_id){
            setSelectedDevice(device_id)
            setSelectedDeviceName(device_name)
        }
    }, [location, setSelectedDevice, setSelectedDeviceName])
    return(
        <Select
            isClearable
            isSearchable
            isLoading={deviceSelectStatus === 'loading' || isNeedToLoading }
            name="device"
            options={deviceSelectData}
            className="mb-3"
            placeholder="Select Device"
            value={deviceSelectData? deviceSelectData.find(obj => obj.value === selectedDevice) : []}
            onChange={(e) => {
                setSelectedDeviceName(!!e ? e.label : "")
                setSelectedDevice(!!e ? e.value : -1)
            }}
        />
    )
}

export default DeviceFilterContainer