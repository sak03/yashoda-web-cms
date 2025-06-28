import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { sidebarSow } from '../redux/action'
import './appHeader.css'

const AppHeader = () => {
  const dispatch = useDispatch();
  const userInfo1 = localStorage.getItem("userInfo");
  // const userInfo = JSON.parse(userInfo1);
  const sidebarShow = useSelector((state) => state.changeState.sidebarShow);
  // const userInfo = useSelector((state) => state.userLoginInfo);
  const userInfo = JSON.parse(localStorage.getItem('token'));
  // console.log("AppHeaderUserInfo", userInfo);

  return (
    <>
      <CHeader position="sticky" className="mb-2">
        <CContainer fluid>
          <div className='d-flex justify-content-start'>
            <CHeaderToggler
              className="ps-1"
              onClick={() => dispatch(sidebarSow({ type: 'set', sidebarShow: !sidebarShow }))}
            >
              <CIcon icon={cilMenu} size="lg" />
            </CHeaderToggler>
          </div>
          <div className='d-flex justify-content-end'>
            <CHeaderNav>
              {/* <CNavItem> */}
                <CNavLink >
                  Sartaj Alam
                </CNavLink>
              {/* </CNavItem> */}
            </CHeaderNav>
            <CHeaderNav className="ms-3">
              <AppHeaderDropdown />
            </CHeaderNav>
          </div>
        </CContainer>
        <CHeaderDivider style={{ marginTop: "0", marginBottom: "2px" }} />
        <CContainer fluid style={{ margin: "-0.5rem 0.5rem" }}>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>
    </>
  )
}

export default AppHeader
