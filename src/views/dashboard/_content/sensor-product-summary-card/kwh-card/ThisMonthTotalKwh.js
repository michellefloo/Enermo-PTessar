import React, { Fragment, useState, useEffect} from 'react'
import {
    CCol,
    CWidgetIcon,
    CSpinner
  } from '@coreui/react'
import { cilDollar } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useGetDeviceList } from '../../../../../api/device'
import { useGetParameterList } from "../../../../../api/setting";
import { useGetDeviceMonitoring } from '../../../../../api/dashboard'
import moment from 'moment'

const GetKwhThisMonth = (id_device) => {
    const {data, status} = useGetDeviceMonitoring(id_device, 'edel', 
                moment().startOf("month").unix(), moment().endOf("month").unix())
    const [kwh, setKwh] = useState(null)
    const [isTotalingDone, setIsTotalingDone] = useState(false)
    useEffect(() => {
        if(status === "success"){
            if(!data) return 
            if(!data.result) return 
            const r = data.result.filter((item) => item.type === 'edel')
            const resultLength = r.length
            console.log("+===============+")
            console.log(id_device)
            console.log(r)
            if(resultLength === 0) return
            if(!r[0].value) return
                const totalWh = Math.abs(Number(r[resultLength-1].value) - Number(r[0].value))
                console.log("totalwh", totalWh)
                setKwh(Number(totalWh/1000).toFixed(2))
            if(totalWh >= 0)
                setIsTotalingDone(true)
        }
    }, [data, status])
    if((status === "success") && kwh && isTotalingDone)
        return {status: "success", data: {result: kwh}}
}

const ThisMonthTotalKwh = () => {
    const { data } = useGetDeviceList()
    const { data: paremeterData, status: paramterStatus } = useGetParameterList()
    const [allRqStatus, setAllRqStatus] = useState("loading")
    const kwhThisMonthArr = []
    if(!data.result){
        return (
            <Fragment>
                <br/>
                <CCol xs="12" sm="6" lg="4">
                    <CSpinner className="spinner spinner--spacer-bottom"
                        color="primary" variant="grow"
                    />
                </CCol>
            </Fragment>
        )
    }
    if(allRqStatus === "loading"){
        data.result.map((device, index) => {
            if(device.is_main_panel === 1){
                kwhThisMonthArr.push(GetKwhThisMonth(device.id))
            }
        })
    }
    let counter = null
    console.log(kwhThisMonthArr)
    kwhThisMonthArr.forEach((item) => {
        if(!item) return
        if(item){
            counter += 1
            setAllRqStatus("success")
        }
    })
    if(!(counter >= kwhThisMonthArr.length) || paramterStatus === "loading")
        return (
            <Fragment>
                <br/>
                <CCol xs="12" sm="6" lg="4">
                    <CSpinner className="spinner spinner--spacer-bottom"
                        color="primary" variant="grow"
                    />
                </CCol>
            </Fragment>
        )   
    const getAllTotal = () => {
        let total = 0
        kwhThisMonthArr.forEach((item) => {
            if(!item) return
            if(item){
                total += Number(item.data.result)
            }
        })
        return (total * paremeterData.normal_tarrif)
    }
    if((counter >= kwhThisMonthArr.length)&& paramterStatus === "success")
        return (
            <Fragment>
                <CWidgetIcon color="info" iconPadding={false}
                            header={"Rp. " + getAllTotal().toLocaleString()} text="This Month Total Est. Bill" 
                            className="text-uppercase font-weight-bold"
                >
                    <CIcon width={24} content={cilDollar} />
                </CWidgetIcon>
            </Fragment>
        )
  }

  export default ThisMonthTotalKwh