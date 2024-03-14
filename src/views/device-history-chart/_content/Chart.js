// import React, { useEffect, useState, useContext } from "react";
// import { useGetDeviceMonitoringNotLive } from '../../../api/dashboard'
// import { useGetSensorByIddDeviceList } from '../../../api/sensor'
// import BigSPinner from '../../../components/ui/big-spinner/BigSpinner'
// import moment from "moment";
// import {
//     CChartLine,
// } from '@coreui/react-chartjs'
// import {
//     CRow,CCol,
// } from '@coreui/react'
// import { SENSOR_COLOR_PER_TYPE, DATE_ISO8601, EXCLUDED_CHART_PARAM } from '../../../utils/constant'
// import { getSensorInChartNaming } from '../../../utils/helpers'
// import { DeviceHistoryContext2 } from '../_provider/DeviceHistoryChartProvider'

// const LiveSensorChart = () => {
//     const {selectedStartDate, selectedDevice} = useContext(DeviceHistoryContext2) 
//     const id_device = selectedDevice.id
//     const { data:sensorData, status:sensorStatus } = useGetSensorByIddDeviceList(id_device)
//     const {data, status} = useGetDeviceMonitoringNotLive(id_device, null, 
//         moment(selectedStartDate).startOf("day").unix(), 
//         moment(selectedStartDate).endOf("day").unix())
//     const [chartData, setChartData] = useState(null)
//     const [chartLabels, setChartLabels] = useState(null)
//     useEffect(() => {
//         const chartData = []
//         if(sensorStatus === 'success'){
//             if(!sensorData) return setChartData({})
//             if(!sensorData.result) return setChartData({})
//             sensorData.result.forEach(sensor => {
//                 if(sensor.sensor_type_parameter in EXCLUDED_CHART_PARAM) return
//                 chartData.push({
//                     param: sensor.sensor_type_parameter,
//                     label: getSensorInChartNaming(sensor.sensor_type_parameter),
//                     borderColor: SENSOR_COLOR_PER_TYPE[sensor.sensor_type_parameter],
//                     data: [0],
//                 })
//             })
//         }
//         if(status === "success"){
//             if(!data) return setChartData({})
//             if(!data.result) return setChartData({})
//             // const filtered = data.result.filter(
//             //     (item) => moment.unix(item.time_unix).isSame(moment.unix(moment(selectedStartDate).endOf("day")), 'day')
//             // )
//             const filtered = data.result
//             // console.log("========================")
//             // console.log(filtered)
//             if(!filtered) return setChartData({})
//             const valueByParam = {}
//             const labels = []
//             filtered.forEach((item) => {
//                 if(!(item.type in valueByParam)){
//                     valueByParam[item.type] = []
//                 }
//                 valueByParam[item.type].push({ x: moment(item.created_on).format(DATE_ISO8601), y: item.value})
//                 if(String(item.type) === String(filtered[0].type)){
//                     labels.push(moment(item.created_on).format("MM-DD HH:mm:ss"))
//                 }
//             })
//             chartData.forEach((item) => {
//                 item.data = valueByParam[item.param]
//             })
//             setChartLabels(labels)
//             setChartData(chartData)
//         }
//     }, [data, status, sensorData, sensorStatus, selectedStartDate])
//     if(!chartData) return <BigSPinner/>
//     return (
//         <>
//             <CRow>
//                 <CCol>
//                      <CChartLine 
//                             labels={chartLabels}
//                             datasets={chartData}
//                     />
//                 </CCol>
//             </CRow>
//             {/* <div className="bg-info text-lg-center font-weight-bold">Incoming Live Data</div> */}
//         </>
//     )
// }

// export default LiveSensorChart