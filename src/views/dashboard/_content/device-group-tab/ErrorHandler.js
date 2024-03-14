import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useGetDeviceGroupList } from '../../../../api/device-group'

const DeviceGroupTabErrorHandler = () => {
    const dispatch = useDispatch()
    const { data:deviceGroupData, status:deviceGroupStatus } = useGetDeviceGroupList()
    useEffect(() => {
        if(!deviceGroupData) return
        if((deviceGroupStatus === 'error') || (deviceGroupData.result.length === 0)){
            dispatch({
                type: 'set', 
                infoHeaderShow: true,
                theObjectNotFound: "device group",
                objectNoFoundDataLink: "/device/group/list"
            })
        }
        if(deviceGroupStatus === 'success' && deviceGroupData.result.length > 0){
            dispatch({
                type: 'set', 
                infoHeaderShow: false,
                theObjectNotFound: null,
                objectNoFoundDataLink: null
            })
        }
    }, [deviceGroupData, deviceGroupStatus, dispatch])

    return null
}
export default DeviceGroupTabErrorHandler