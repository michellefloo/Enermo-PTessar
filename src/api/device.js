import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'

export const useGetDeviceList = () => {
    return useFecth(apiRoutes.getDevice, null, {
        queryKey: ["device"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result = data.result.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
            return data
        }
    })
}

export const useGetDeviceSelectList = () => {
    return useFecth(apiRoutes.getDevice, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result = data.result.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)
            const selections = []    
            data.result.forEach(d => selections.push({
                value: d.id,
                label: d.device_desc
            }))
            return selections
        }
    })
}

export const useAddDevice = (updater) => 
    usePost(
        apiRoutes.addDevice,
        updater,
        {queryKey: ["device"]}
    )   

export const useUpdateDevice = (updater) =>
    useUpdate(
        apiRoutes.updateDevice,
        updater,
        {queryKey: ["device"]}
    )

export const useDeleteDevice = (updater) =>
    useDelete(
        apiRoutes.deleteDevice,
        updater,
        {queryKey: ["device"]}
    )