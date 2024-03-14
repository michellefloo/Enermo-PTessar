import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from '../../../../api/dashboard'
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import { TimeConfigProviderContext } from '../../_provider/TimeConfigProvider'
import moment from "moment";

const Cycle = ({id_device, param}) => {
    const {fromStartToday} = useContext(TimeConfigProviderContext)
    const {data:sensorData, status:sensorStatus} = useGetSensorByIddDeviceList(id_device)
    const {data, status} = useGetDeviceMonitoring(id_device, param, fromStartToday.start, fromStartToday.end)
    const [numbersCycle, setNumberCycle] = useState(0)
    useEffect(() => {
        if(status === "success" && sensorStatus === "success"){
            if(!data) return setNumberCycle(0)
            if(!data.result) return setNumberCycle(0)
            const filtered = data.result.filter((item) => item.type === param)
            const filteredSensor = sensorData.result.filter((item) => item.sensor_type_parameter === param)[0]
            const resultLength = filtered.length
            if(resultLength === 0) return setNumberCycle("-")
            let minuteDiff = 0
            let totalCycle = 0
            let lastIndexStartCycle = 0
            for(let i = 0; i < resultLength; i++){
                if(i === 0) continue
                const prev = filtered[lastIndexStartCycle]
                const current = filtered[i]
                if(prev.value < filteredSensor.max_measurement_cap){
                    lastIndexStartCycle = i
                    continue
                }
                minuteDiff += Number(moment(current.time_unix).diff(moment(prev.time_unix), 'minutes'))
                if(minuteDiff >= 10){
                    totalCycle++
                    minuteDiff = 0
                }
            }
            return setNumberCycle(totalCycle)
        }
    }, [data, status, param, sensorStatus, sensorData])
    if(sensorStatus !== "success")
        return "..."
    if(status !== "success")
        return "..."
    return (
        <>
            {numbersCycle}
        </>
    )
}  

export default Cycle