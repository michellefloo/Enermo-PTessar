import React, { useEffect, useState, useContext } from "react";
import { useGetKwhAvg } from '../../../../api/dashboard'
import { TimeConfigProviderContext } from '../../_provider/TimeConfigProvider'

const KwhX = ({id_device, id_sensor}) => {
    const {kwhAvgTime} = useContext(TimeConfigProviderContext)
    const {data, status} = useGetKwhAvg(id_device, id_sensor, 
                                            kwhAvgTime.start, 
                                            kwhAvgTime.end
                                        )
    const [kwh, setKwh] = useState(0)
    useEffect(() => {
        if(status === "success"){
            if(!data) return setKwh(0)
            if(!data.result) return setKwh(0)
            const resultLength = data.result.length
            if(resultLength === 0) return setKwh(0)
            const lastData = data.result[resultLength-1]
            setKwh(Number(lastData.kwhAvg).toFixed(2))
        }
    }, [data, status])
    if(status !== "success")
        return "..."
    return (
        <>
            {kwh}
        </>
    )
}  

export default KwhX