import React, { useEffect, useState, useContext } from "react";
import { useGetDeviceMonitoring } from '../../../../api/dashboard'
import { TimeConfigProviderContext } from '../../_provider/TimeConfigProvider'

const Hum = ({id_device, param}) => {
    const {deviceMonitorTime} = useContext(TimeConfigProviderContext)
    const {data, status} = useGetDeviceMonitoring(id_device, param, deviceMonitorTime.start, deviceMonitorTime.end)
    const [numbersHum, setNumberHum] = useState(0)
    useEffect(() => {
        if(status === "success"){
            if(!data) return setNumberHum(0)
            if(!data.result) return setNumberHum(0)
            const filtered = data.result.filter((item) => item.type === param)
            const resultLength = filtered.length
            if(resultLength === 0) return setNumberHum("-")
            return setNumberHum(filtered[resultLength-1][param])
        }
    }, [data, status, param])
    if(status !== "success")
        return "..."
    return (
        <>
            {numbersHum}
        </>
    )
}  

export default Hum