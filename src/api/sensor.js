import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete} from '../utils/react-query'
import { DATE_ISO8601_NO_TIME } from '../utils/constant'
import moment from 'moment'

export const useGetSensorList = () => {
    return useFecth(apiRoutes.getSensor, null, {
        queryKey: ["sensor"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result.forEach(d => {
                d.fabrication_date = moment(d.fabrication_date).format(DATE_ISO8601_NO_TIME)
            })
            return data
        }
    })
}

export const useGetSensorByIddDeviceList = (id_device) => {
    return useFecth(apiRoutes.getSensor, {id_device}, {
        queryKey: ["sensor", id_device],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result.forEach(d => {
                d.fabrication_date = moment(d.fabrication_date).format(DATE_ISO8601_NO_TIME)
            })
            return data
        }
    })
}

export const useGetSensorTypeSelectList = () => {
    return useFecth(apiRoutes.getSensorType, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(st => selections.push({
                value: st.id,
                label: st.sensor_type_name + ' - ' + st.sensor_type_parameter
            }))
            return selections
        }
    })
}

export const useGetSensorClassSelectList = () => {
    return useFecth(apiRoutes.getSensorClass, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(st => selections.push({
                value: st.id,
                label: st.sensor_class_code + ' - ' + st.sensor_class_name
            }))
            return selections
        }
    })
}

export const useAddSensor = (updater) => 
    usePost(
        apiRoutes.addSensor,
        updater,
        {queryKey: ["sensor"]}
    )   

export const useUpdateSensor = (updater) =>
    useUpdate(
        apiRoutes.updateSensor,
        updater,
        {queryKey: ["sensor"]}
    )

export const useDeleteSensor = (updater) =>
    useDelete(
        apiRoutes.deleteSensor,
        updater,
        {queryKey: ["sensor"]}
    )