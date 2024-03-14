import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'

export const useGetCustomerList = () => {
    return useFecth(apiRoutes.getCustomer, null, {
        queryKey: ["customer"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            return data
        }
    })
}

export const useGetCustomerSelectList = () => {
    return useFecth(apiRoutes.getCustomer, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = [{
                value: -1,
                label: "None"
            }]    
            data.result.forEach(c => selections.push({
                value: c.id,
                label: c.name
            }))
            return selections
        }
    })
}

export const useAddCustomer = (updater) => 
    usePost(
        apiRoutes.addCustomer,
        updater,
        {queryKey: ["customer"]}
    )   

export const useUpdateCustomer = (updater) =>
    useUpdate(
        apiRoutes.updateCustomer,
        updater,
        {queryKey: ["customer"]}
    )

export const useDeleteCustomer = (updater) =>
    useDelete(
        apiRoutes.deleteCustomer,
        updater,
        {queryKey: ["customer"]}
    )