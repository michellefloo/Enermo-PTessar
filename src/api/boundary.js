import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'

export const useGetBoundaryList = () => {
    return useFecth(apiRoutes.getBoundary, {withBoundary:true}, {
        queryKey: ["boundary"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.transformed = []
            data.result.forEach((d, i) => {
                data.transformed.push({...d})
                data.transformed[i].customer_name = '-'
                if(d.customer){
                    data.transformed[i].customer_name = d.customer.name
                }
                if(!d.parents || !Array.isArray(d.parents)){
                    data.transformed[i].parents = "-" 
                    data.transformed[i].idParents = -1
                    return 
                }
                if(d.parents.length === 0){
                    data.transformed[i].parents = "-" 
                    data.transformed[i].idParents = -1
                    return 
                }
                data.transformed[i].parents = d.parents[0].parent_location_name
                data.transformed[i].idParents = d.parents[0].id_parent_location
            })
            return data
        },
    })
}

export const useGetBoundaryTree = () => {
    return useFecth(apiRoutes.getBoundaryTree, {}, {
        queryKey: ["boundary"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            if(!data.result) return []
            return data.result
        },
    })
}

export const useGetBoundarySelectList = (withNone=true) => {
    return useFecth(apiRoutes.getBoundary, {withBoundary:true}, {
        queryKey: ["boundary"],
        select: (response) => {
            const {data} = response || {}
            const selection = []
            if(withNone){
                selection.push({
                    label: "None",
                    value: -1
                })
            }
            if(!data) return []
            data.result.forEach((d, i) => {
                selection.push({
                    label: d.location_code + ' - ' + d.location_name,
                    value: d.id,
                })
            })
            return selection
        },
    })
}

export const useGetBoundaryTypeList = () => {
    return useFecth(apiRoutes.getBoundaryType, {}, {
        queryKey: ["boundary_type"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selection = []
            data.result.forEach((d, i) => {
                selection.push({
                    label: d.loc_type,
                    value: d.id,
                })
            })
            return selection
        },
    })
}

export const useAddBoundary = (updater) => 
    usePost(
        apiRoutes.addBoundary,
        updater,
        {queryKey: ["boundary"]}
    )   

export const useUpdateBoundary = (updater) =>
    useUpdate(
        apiRoutes.updateBoundary,
        updater,
        {queryKey: ["boundary"]}
    )

export const useDeleteBoundary = (updater) =>
    useDelete(
        apiRoutes.deleteBoundary,
        updater,
        {queryKey: ["boundary"]}
    )