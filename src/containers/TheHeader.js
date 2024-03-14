import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CSubheader,
  CBreadcrumbRouter,
  CImg,
} from '@coreui/react'

// routes config
import routes from '../routes'

import { 
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
}  from './index'

import {
  CompanyName,
  Clock,
  UserName,
} from '../components/ui/header-additionals'

import enermoLogo from '../assets/brand/enermo-logo.png'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.coreUiState.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/">
        <CImg
            className="c-sidebar-brand-full"
            src={enermoLogo}
            alt="enermo logo full"
            height={35}
          />
      </CHeaderBrand>

      <CHeaderNav className="d-md-down-none mr-auto">
        <TheHeaderDropdownMssg/>
        <CompanyName />
      </CHeaderNav>

      <CHeaderNav className="px-3">
        <Clock />
        <TheHeaderDropdown/>
        <UserName />
      </CHeaderNav>


      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
