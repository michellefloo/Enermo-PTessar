import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'

export const useGetDeviceGroupDetailList = () => {
    return useFecth(apiRoutes.getDeviceGroupDetailList, null, {
        queryKey: ["deviceGroupDetail"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            return data
        }
    })
}

export const useGetDeviceGroupDetailListByIdGroup = (id_group_devices=-1) => {
    return useFecth(apiRoutes.getDeviceGroupDetailList, {id_group_devices}, {
        queryKey: ["deviceGroupDetail", id_group_devices],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            return data
        }
    })
}

export const useAddDeviceGroupDetail = (updater, id_group_devices) => 
    usePost(
        apiRoutes.addDeviceGroupDetail,
        updater,
        {queryKey: ["deviceGroupDetail", id_group_devices]}
    )   

export const useUpdateDeviceGroupDetail = (updater, id_group_devices) =>
    useUpdate(
        apiRoutes.updateDeviceGroupDetail,
        updater,
        {queryKey: ["deviceGroupDetail", id_group_devices]}
    )

export const useDeleteDeviceGroupDetail = (updater, id_group_devices) =>
    useDelete(
        apiRoutes.deleteDeviceGroupDetail,
        updater,
        {queryKey: ["deviceGroupDetail", id_group_devices]}
    )