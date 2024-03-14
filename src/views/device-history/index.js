import React from 'react'
import DeviceHistoryProvider from './_provider/DeviceHistoryProvider'
import DeviceHistory from './DeviceHistory'

const Dashboard = () => {
    return (
        <DeviceHistoryProvider>
            <DeviceHistory />
        </DeviceHistoryProvider> 
    )
}

export default Dashboard