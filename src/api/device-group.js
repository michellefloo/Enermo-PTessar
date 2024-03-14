import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'

export const useGetDeviceGroupList = () => {
    return useFecth(apiRoutes.getDeviceGroupList, null, {
        queryKey: ["deviceGroup"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            return data
        }
    })
}

export const useGetDeviceGroupSelectList = () => {
    return useFecth(apiRoutes.getDeviceGroupList, null, {
        queryKey: ["deviceGroup"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(c => selections.push({
                value: c.id,
                label: c.group_name + ' - ' + c.group_description,
                name: c.group_name,
                desc: c.group_description
            }))
            return selections
        }
    })
}

export const useAddDeviceGroup = (updater) => 
    usePost(
        apiRoutes.addDeviceGroup,
        updater,
        {queryKey: ["deviceGroup"]}
    )   

export const useUpdateDeviceGroup = (updater) =>
    useUpdate(
        apiRoutes.updateDeviceGroup,
        updater,
        {queryKey: ["deviceGroup"]}
    )

export const useDeleteDeviceGroup = (updater) =>
    useDelete(
        apiRoutes.deleteDeviceGroup,
        updater,
        {queryKey: ["deviceGroup"]}
    )