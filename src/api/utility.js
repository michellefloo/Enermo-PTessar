import apiRoutes from './routes'
import { useFecth, usePost, useUpdate, useDelete } from '../utils/react-query'
import { DATE_ISO8601_NO_TIME } from '../utils/constant'
import moment from 'moment'

export const useGetUtilityList = () => {
    return useFecth(apiRoutes.getUtility, null, {
        queryKey: ["Utility"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            data.result.forEach(d => {
                d.installation_date = moment(d.installation_date).format(DATE_ISO8601_NO_TIME)
                d.fabrication_date = moment(d.fabrication_date).format(DATE_ISO8601_NO_TIME)
            })
            return data
        }
    })
}

export const useGetUtilityTypeList = () => {
    return useFecth(apiRoutes.getUtilityType, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(ut => selections.push({
                value: ut.id,
                label: ut.utility_type_name
            }))
            return selections
        }
    })
}

export const useGetUtilityUsageScheduleList = () => {
    return useFecth(apiRoutes.getUtilityUsageSchedule, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(ut => selections.push({
                value: ut.id,
                label: ut.usage_sched_name
            }))
            return selections
        }
    })
}

export const useGetUtilityResourceList = () => {
    return useFecth(apiRoutes.getUtilityResource, null, {
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            const selections = []    
            data.result.forEach(ut => selections.push({
                value: ut.id,
                label: ut.resource_usage_type_name
            }))
            return selections
        }
    })
}

export const useAddUtility = (updater) => 
    usePost(
        apiRoutes.addUtility,
        updater,
        {queryKey: ["Utility"]}
    )   

export const useUpdateUtility = (updater) =>
    useUpdate(
        apiRoutes.updateUtility,
        updater,
        {queryKey: ["Utility"]}
    )

export const useDeleteUtility = (updater) =>
    useDelete(
        apiRoutes.deleteUtility,
        updater,
        {queryKey: ["Utility"]}
    )