import React, { useState, useEffect } from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useGetCalibrationExpiryAlertCount, useGetCalibrationExpiryAlertList } from 'src/api/device-installation'

const TheHeaderDropdownMssg = () => {
  const [itemsCount, setItemCount] = useState(0)
  const {data: ceaCount, status: ceaStatus} = useGetCalibrationExpiryAlertCount()
  const {data: ceaList, status: ceaListStatus} = useGetCalibrationExpiryAlertList()
  const [ceaListState, setCeaListState] = useState([])

  useEffect(() => {
    async function getCealist() {
      if(ceaListStatus === 'success') 
        setCeaListState(await ceaList)
   }
    let result = 0
    if(ceaStatus === 'success') result = result + ceaCount
    setItemCount(result)
    getCealist()
    // eslint-disable-next-line
  }, [ceaCount, ceaStatus, ceaListStatus])
  
  const CalibrationExpiryDropdownItem = () => {
    if(ceaListStatus === 'success') {
      return ceaListState.map((item, index) => (
        <CDropdownItem href="#/device/installation/list" key={index+1}>
          <div className="message">
          <div className="pt-3 mr-3 float-left">
              <div className="c-avatar">
                  <CIcon name="cil-calendar" size="xl" />
              </div>
            </div>
            <div className="text-truncate font-weight-bold">{item.device_name} Calibration Expiry</div>
            <div className="small text-muted">This device on <b>{item.location_name}</b> installed by <b>{item.installed_by}</b> calibration&nbsp;
                <span className={item.expiry_status === 1? "text-warning" : "text-danger"}><b>{item.expiry_status === 1? "will soon expired" : "has expired"}</b></span>. 
                <br />Please schedule a recalibration to ensure optimal performance.
              </div>
          </div>
        </CDropdownItem>
      ))
    }
    return null
  }

  return (
    <CDropdown
      inNav
      className="c-header-nav-item mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon name="cil-bell" /><CBadge shape="pill" color="info">{itemsCount}</CBadge>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" style={{width:"550px"}}>
        <CDropdownItem
          header
          tag="div"
          color="light"
        >
          <strong>You have {itemsCount} notifications</strong>
        </CDropdownItem>
        <CalibrationExpiryDropdownItem />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdownMssg