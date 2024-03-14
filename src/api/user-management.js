import apiRoutes from './routes'
import { useFecth, useUpdate, usePost } from '../utils/react-query'

export const useGetUserManagementList = () => {
    return useFecth(apiRoutes.getUserList, {status:0}, {
        queryKey: ["user"],
        select: (response) => {
            const {data} = response || {} 
            if(!data) return []           
            return data.result
        }
    })
}

export const useGetUserCompanyList = () => {
    return useFecth(apiRoutes.getUserCompanyList, null , {
        queryKey: ["user_company"],
        select: (response) => {
            const {data} = response || {} 
            if(!data) return []           
            return data.result[0]
        }
    })

}

export const useGetUserManagementUsersAllCount = () => {
    return useFecth(apiRoutes.getUserList, {status:0}, {
        queryKey: ["user"],
        select: (response) => {
            const {data} = response || null
            if(!data) return []
            return data.result.length
        }
    })
}

export const useGetUserManagementUsersLockCount = () => {
    return useFecth(apiRoutes.getUserList, {status:0}, {
        queryKey: ["user"],
        select: (response) => {
            const {data} = response || null
            if(!data) return []
            return data.result.filter(d => d.status === 4).length
        }
    })
}

export const useGetUserManagementUnverifiedCount = () => {
    return useFecth(apiRoutes.getUserList, {status:0}, {
        queryKey: ["user"],
        select: (response) => {
            const {data} = response || null
            if(!data) return []
            return data.result.filter(d => d.verified === 0).length
        }
    })
}

export const useGetMobileAppsUserCount = () => {
    return useFecth(apiRoutes.getUserList, {status:0}, {
        queryKey: ["user"],
        select: (response) => {
            const {data} = response || null
            if(!data) return []
            return data.result.filter(d => d.id_level === 12 && d.status === 1).length
        }
    })
}

export const useAddUserMan = (updater) => {
    return usePost(
        apiRoutes.addUser,
        updater,
        {queryKey: ["user"]}
    )
}

export const useUpdateStatus = (updater) => {
    return useUpdate(
        apiRoutes.updateStatus,
        updater,
        {queryKey: ["user"]}
    )
}

export const useUpdatePassword = (updater) => {
    return useUpdate(
        apiRoutes.updatePassword,
        updater,
        {queryKey: ["user"]}
    )
}

export const useResendEmail = (updater) => {
    return useUpdate(
        apiRoutes.resendVerifEmail,
        updater,
        {queryKey: ["user"]}
    )
}

export const useUpdateUserCompany = (updater) => {
    return useUpdate(
        apiRoutes.updateUserCompany,
        updater,
        {queryKey: ["user_company"]}
    )
}