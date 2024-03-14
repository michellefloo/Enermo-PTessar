import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from '../../../../api/dashboard'
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import { TimeConfigProviderContext } from '../../_provider/TimeConfigProvider'
import moment from "moment";

const CycleKwh = ({id_device, param}) => {
    const {fromStartToday} = useContext(TimeConfigProviderContext)
    const {data:sensorData, status:sensorDataStatus} = useGetSensorByIddDeviceList(id_device)
    const {data, status} = useGetDeviceMonitoring(id_device, param, fromStartToday.start, fromStartToday.end)
    const [numbersKwhCycle, setNumberKwhCycle] = useState(0)
    useEffect(() => {
        if(status === "success" && sensorDataStatus === "success"){
            if(!data) return 
            if(!data.result) return 
            const filteredSensor = sensorData.result.filter((item) => item.sensor_type_parameter === param)[0]
            const filtered = data.result.filter((item) => item.type === param)
            const resultLength = filtered.length
            if(resultLength === 0) return 
            let minuteDiff = 0
            let totalCycle = 0
            let lastIndexStartCycle = 0
            for(let i = 0; i < resultLength; i++){
                if(i === 0) continue
                const prev = filtered[lastIndexStartCycle]
                const current = filtered[i]
                minuteDiff = minuteDiff + Number(moment(current.created_on).diff(moment(prev.created_on), 'minutes'))
                if(minuteDiff >= 60){
                    const kwhCurrent = ((Number(current.value) - Number(prev.value)) / 1000).toFixed(2)
                    if(kwhCurrent > Number(filteredSensor.max_measurement_cap)){
                        totalCycle++
                    }
                    lastIndexStartCycle = i
                    minuteDiff = 0
                }
            }
            return setNumberKwhCycle(totalCycle)
        }
    }, [data, status, param, sensorData, sensorDataStatus])
    if(status !== "success")
        return "..."
    return (
        <>
            {numbersKwhCycle}
        </>
    )
}  

export default CycleKwh