import apiRoutes from './routes'
import { useFecth, usePost, useUpdate } from '../utils/react-query'
import { DATE_ISO8601_NO_TIME, ALERT_DIFF_DAYS } from '../utils/constant'
import moment from 'moment'
import axios from 'src/utils/axios'

export const useGetDeviceInstallByIddDeviceList = (id_device=-1) => {
    return useFecth(apiRoutes.getDeviceInstalltion, {id_device}, {
        queryKey:["device-installation", id_device],
        refetchInterval: 3600000,
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result.forEach((d, i) => {
                d.installation_date = moment(d.installation_date).format(DATE_ISO8601_NO_TIME)
                d.calibration_date_expiry = moment(d.calibration_date_expiry).format(DATE_ISO8601_NO_TIME)
                d.removal_date = d.removal_date ? moment(d.removal_date).format(DATE_ISO8601_NO_TIME) : ''
                if(data.result.length === i+1) d._last = true
            })
            return data
        }
    })
}

export const useGetLastDeviceInstallByIddDeviceList = (id_device=-1) => {
    return useFecth(apiRoutes.getDeviceInstalltion, {id_device}, {
        queryKey:["device-installation", id_device],
        refetchInterval: 3600000,
        select: (response) => {
            const {data} = response || {}
            if(!data) return null
            if(!data.result) return null
            return data.result[data.result.length-1]
        }
    })
}


export const useGetCalibrationExpiryAlertCount = () => {
    return useFecth(apiRoutes.getDeviceInstalltion, null, {
        queryKey:["calibration-expiry-alert"],
        refetchInterval: 3600000,
        select: (response) => {
            const {data} = response || {}
            if(!data) return 0
            if(!data.result) return 0
            const {result} = data
            return result.filter(d => 
                d.removal_date === null &&
                (Number(moment(d.calibration_date_expiry).diff(moment(), 'days')) <= ALERT_DIFF_DAYS)
            ).length
        }
    })
}

export const useGetCalibrationExpiryAlertList = () => {
    return useFecth(apiRoutes.getDeviceInstalltion, null, {
        queryKey:["calibration-expiry-alert"],
        refetchInterval: 3600000,
        select: async (response) => {
            const fetchDeviceList = await axios.post(apiRoutes.getDevice,null)
            if(fetchDeviceList.status !== 200) return []
            const {data: deviceList} = fetchDeviceList || {}
            if(!deviceList) return []
            const {data} = response || {}
            if(!data) return []
            if(!data.result) return []
            const result = data.result.filter(d => 
                d.removal_date === null &&
                (Number(moment(d.calibration_date_expiry).diff(moment(), 'days')) <= ALERT_DIFF_DAYS)
            )
            result.forEach(d => {
                const diff = Number(moment(d.calibration_date_expiry).diff(moment(), 'days'))
                d.device_name = deviceList.result.find(dl => dl.id === d.id_sensor)?.device_desc
                if(diff < 1)
                    return d.expiry_status = 2
                if(diff <= 5)
                    return d.expiry_status = 1
            })
            return result
        }
    })
}

export const useAddDeviceInstallation = (updater, id_device) => 
    usePost(
        apiRoutes.addDeviceInstallation,
        updater,
        {queryKey: ["device-installation", id_device]}
    )   

export const useUpdateDeviceInstallation = (updater, id_device) =>
    useUpdate(
        apiRoutes.updateDeviceInstallation,
        updater,
        {queryKey: ["device-installation", id_device]}
    )

export const useRemoveDeviceInstallation = (updater, id_device) =>
    useUpdate(
        apiRoutes.removeDeviceInstallation,
        updater,
        {queryKey: ["device-installation", id_device]}
    )