import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetBoundaryList } from '../../../api/boundary'
import { toast } from 'react-toastify';

const BoundaryErrorHandler= () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetBoundaryList()
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
export default BoundaryErrorHandler