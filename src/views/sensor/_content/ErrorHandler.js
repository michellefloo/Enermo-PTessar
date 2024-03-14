import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetSensorList } from '../../../api/sensor'
import { toast } from 'react-toastify';

const SensorErrorHandler = () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetSensorList()
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
export default SensorErrorHandler