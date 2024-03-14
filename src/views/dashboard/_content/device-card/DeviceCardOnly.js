import React from "react";
import { useGetDeviceList } from '../../../../api/device'
import DeviceCardFactory from "./DeviceCardFactory";
import {
    CRow, CCol,
} from '@coreui/react'

const DeviceCard = () => {
    const { data } = useGetDeviceList()
    return (
        <CRow>
            {/* <CCol xs="2" md="2" xl="2">
                <DeviceCardNav/>
            </CCol> */}
            {data && data.result.map((device, index) => (
                device.is_main_panel === 1 ?
                    <CCol xs="6" md="6" xl="6" key={index+1}>
                        <DeviceCardFactory device={device}/>
                    </CCol>
                :
                    null
            ))}
        </CRow>
    )
}

export default DeviceCard