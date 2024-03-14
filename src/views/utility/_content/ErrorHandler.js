import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetUtilityList } from '../../../api/utility'
import { toast } from 'react-toastify';

const UtilityErrorHandler = () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetUtilityList()
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
export default UtilityErrorHandler