import React from 'react'
import DeviceHistoryChartProvider from './_provider/DeviceHistoryChartProvider'
import DeviceHistoryChart from './DeviceHistoryChart'

const Dashboard = () => {
    return (
        <DeviceHistoryChartProvider>
            <DeviceHistoryChart />
        </DeviceHistoryChartProvider> 
    )
}

export default Dashboard