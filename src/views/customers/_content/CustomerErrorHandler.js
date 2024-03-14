import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetCustomerList } from '../../../api/customer'
import { toast } from 'react-toastify';

const CustomerErrorHandler = () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetCustomerList()
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
export default CustomerErrorHandler