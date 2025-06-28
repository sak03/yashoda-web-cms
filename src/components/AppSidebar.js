import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from '../assets/images/yashoda_site_logo.png'
import logosmall from '../assets/images/yashoda_site_logo.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const userMode = useSelector((state) => state.userInfo.userModeValue);
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex bg-white" to="/">
        {sidebarShow ? (
          <img src={logo} className="sidebar-brand-full" />
        ) : (
          <img src={logosmall} className="sidebar-brand-narrow" width={40} />
        )}
      </CSidebarBrand>
      <CSidebarNav className="d-none d-md-flex bg-dark">
        <SimpleBar className="text-dark">
          <AppSidebarNav items={
            navigation.admin_nav
          }
          />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  )
}

export default React.memo(AppSidebar);
