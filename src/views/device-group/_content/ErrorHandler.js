import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetDeviceInstallByIddDeviceList } from '../../../api/device-installation'
import { toast } from 'react-toastify';

const DeviceInstallationErrorHandler = () => {
    const dispatch = useDispatch()
    const {status: rqStatus, error: rqError} = useGetDeviceInstallByIddDeviceList()
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
export default DeviceInstallationErrorHandler