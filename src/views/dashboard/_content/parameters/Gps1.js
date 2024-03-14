import React, { useEffect, useState, useContext } from "react";
import { useGetSensorByIddDeviceList } from "src/api/sensor";
import { useGetDeviceMonitoring } from '../../../../api/dashboard'
import { TimeConfigProviderContext } from '../../_provider/TimeConfigProvider'
import CIcon from '@coreui/icons-react'
import { cilLocationPin } from '@coreui/icons'

export const Gps1 = ({id_device}) => {
    const {fromStartToday} = useContext(TimeConfigProviderContext)
    const {data:sensorData, status:sensorStatus} = useGetSensorByIddDeviceList(id_device)
    const {data, status} = useGetDeviceMonitoring(id_device, null, fromStartToday.start, fromStartToday.end)
    const [gpsCoordinate, setGpsCoordinate] = useState(null)
    useEffect(() => {
        if(status === "success" && sensorStatus === "success"){
            if(!data) return 
            if(!data.result) return
            if(data.result.length === 0) return 
            const filteredLatData = data.result.filter((item) => item.type === 'latdata')
            const lastLatData = filteredLatData[filteredLatData.length - 1]
            const filteredLonData = data.result.filter((item) => item.type === 'londata')
            const lastLonData = filteredLonData[filteredLonData.length - 1]
            if(!lastLatData) return
            if(!lastLonData) return
            setGpsCoordinate({lat:lastLatData.value, lon:lastLonData.value})
        }
    },[data, status, sensorStatus, sensorData])
    return (
        <>
            <CIcon content={cilLocationPin} 
                className={gpsCoordinate ? "text-success" : "text-muted"}
                style={{
                    cursor: gpsCoordinate ? "pointer" : "default",
                    marginRight: "5px",
                    marginTop: "-7px"
                }}
                onClick={() => {
                    gpsCoordinate && window.open(
                            `https://www.google.com/maps?q=loc:@${gpsCoordinate.lat},${gpsCoordinate.lon}`,
                            "_blank"
                    )
                }}
            /> 
        </>
    )
}

export default Gps1