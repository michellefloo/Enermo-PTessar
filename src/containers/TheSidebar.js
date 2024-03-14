import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CImg
} from '@coreui/react'

// sidebar nav config
import navigation from './_nav'

import enermoLogo from '../assets/brand/enermo-logo.png'
import automaLogoMin from '../assets/brand/automa-logo-min.png'

const TheSidebar = () => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.coreUiState.sidebarShow)

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
        <CImg
          className="c-sidebar-brand-full"
          src={enermoLogo}
          alt="enermo logo full"
          height={35}
        />
        <CImg
          className="c-sidebar-brand-minimized"
          src={automaLogoMin}
          alt="enermo logo minimized"
          height={35}
        />
      </CSidebarBrand>
      <CSidebarNav>

        <CCreateElement
          items={navigation}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none"/>
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
