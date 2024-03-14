import apiRoutes from './routes'
import { useFecth, useUpdate} from '../utils/react-query'
import moment from 'moment'

export const useGetParameterList = () => {
    return useFecth(apiRoutes.getBudgetSetting, null, {
        queryKey: ["setting"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            if(!data.result) return []
            const {result} = data
            const normal_tarrif = result.find(d => d.id_field_budget === 10001)
            const peak_tarrif = result.find(d => d.id_field_budget === 10002)
            const carb_per_kwh = result.find(d => d.id_field_budget === 10003)
            return {
                normal_tarrif: normal_tarrif? normal_tarrif.budget_limit : 0,
                peak_tarrif: peak_tarrif? peak_tarrif.budget_limit : 0,
                carb_per_kwh: carb_per_kwh? carb_per_kwh.budget_limit : 0,
            }
        }
    })
}

export const useGetBudgetList = () => {
    return useFecth(apiRoutes.getBudgetSetting, null, {
        queryKey: ["setting"],
        select: (response) => {
            const {data} = response || {}
            if(!data) return []
            if(!data.result) return []
            const {result} = data
            const queryResult = {}
            result.filter(d => 
                d.id_field_budget !== 10001 && 
                d.id_field_budget !== 10002 &&
                d.id_field_budget !== 10003 &&
                d.id_field_budget !== 10005
            )
            .forEach(d => {
                if(d.id_field_budget === 10004)
                    return queryResult[d.id_field_budget] = d.budget_limit
                if(String(d.id_field_budget).slice(-4) === moment().format("YYYY"))
                    return queryResult[d.id_field_budget] = d.budget_limit
            })
            return queryResult
        }
    })
}

export const useUpdateBudget = (updater) =>
    useUpdate(
        apiRoutes.budgetSettingUpsert,
        updater,
        {queryKey: ["setting"]}
    )


export const useUpdateParameter = (updater) =>
    useUpdate(
        apiRoutes.budgetSettingUpsert,
        updater,
        {queryKey: ["setting"]}
    )
