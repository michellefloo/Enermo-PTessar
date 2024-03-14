import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetUserManagementList } from '../../../api/user-management'
import { toast } from 'react-toastify';

const UserManagementErrorHandler = () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetUserManagementList()
    useEffect(() => {
        if(rqStatus === 'error'){
            const {message} = rqError
            toast.error(message)
            dispatch({type: 'set', infoHeaderShow: true})
        }
        if(rqStatus === 'success'){
            dispatch({type: 'set', infoHeaderShow: false})
        }
    }, [rqStatus, rqError, dispatch])

    return null
}
export default UserManagementErrorHandler