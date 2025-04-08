import * as antdIcons from '@ant-design/icons';
import Icon, {
  CreditCardOutlined,
  LayoutOutlined,
  LogoutOutlined,
  MoonFilled,
  SunFilled
} from '@ant-design/icons';
import {
  DefaultFooter,
  ProBreadcrumb,
  ProConfigProvider,
} from '@ant-design/pro-components';
import ProLayout from '@ant-design/pro-layout';
import { Button, Col, Dropdown, Flex, Form, Select, Tooltip, theme } from 'antd';
import { Content } from 'antd/es/layout/layout';
import moment from 'moment';
import { useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as LightModeIcon } from './../../assets/icons/light-mode.svg';
// import { ReactComponent as DarkModeIcon } from './../../assets/icons/dark-mode.svg';

import userIcon from './../../assets/images/user.jpg';
import { logout, useIAMClientState } from '../common/iam-client-react';
import { IconType } from '../common/iam-client-react/constants/icon-type';
import { MenuItem } from '../common/utils';

import { HeaderFullscreen, NotificationComponent, OnlineStatus } from '../common/header';
import { ActionTypes } from '../common/iam-client-react/action-types';
import { components } from './all-components';
import { svgIcons } from './all-svg-icons';
import { blue } from '@ant-design/colors';

import SChemaxShortLightLogo from '../../assets/images/schemax-short-logo-light.png'
import SChemaxWhiteLogo from '../../app/common/iam-client-react/login-component/images/schemaxlogowhite.png'
import sakkuLogo from '../../assets/images/sakku-logo-1979.jpg'

import changeImg from './change.png'

import { Typography } from 'antd/lib';
const { Option } = Select;
const { useToken } = theme;

import './pro-layout.css'
import { configVariables } from '@hrexpert/shared-services';

/* eslint-disable-next-line */
export interface CustomProLayoutProps { }
const renderIcon = (iconType, iconName) => {
  if (iconType === IconType.SYS_LIB) {
    const SpecificIcon = antdIcons[iconName] ? antdIcons[iconName] : antdIcons["SolutionOutlined"];
    return <SpecificIcon />
  }
  else {
    const SpecificIcon = svgIcons[iconName];
    return <Icon component={SpecificIcon} style={{ fontSize: '20px' }} />
  }
}



const getSubMenu = (route) => {
  if (route && route?.subMenuData && route?.subMenuData?.length >= 1) {
    return {
      key: `${route?.menuId ? route?.menuId : route?.subMenuId}`,
      icon: renderIcon(route.iconType, route.iconName),
      name: route.title,
      routes: route.subMenuData.map(item => getSubMenu(item)),
      path: route.path ? route.path : `${route.key}`
    }
  } else if (route && route.subMenuChildren && route.subMenuChildren.length && route.subMenuChildren.length >= 1) {
    return {
      key: `${route?.menuId ? route?.menuId : route?.subMenuId}`,
      icon: renderIcon(route.iconType, route.iconName),
      name: route.title,
      routes: route.subMenuChildren.map(item => getSubMenu(item)),
      path: route.path ? route.path : `${route.key}`
    }
  } else if (route?.subMenuData?.length === 1) {
    if (route?.subMenuData[0]?.isRouteOnly) {
      const menu: any = {}
      return menu
    }
    else if (route && route.subMenuData[0].subMenuChildren && route.subMenuData[0].subMenuChildren.length) {
      return {
        key: `${route?.menuId ? route?.menuId : route?.subMenuId}`,
        icon: renderIcon(route.iconType, route.iconName),
        name: route.title,
        routes: route.subMenuData.map(item => getSubMenu(item)),
        path: route.path ? route.path : `${route.key}`
      }
    } else {
      return {
        key: `${route.subMenuData[0].key}`,
        icon: renderIcon(route.subMenuData[0].iconType, route.subMenuData[0].iconName),
        name: route.subMenuData[0].title,
        path: route.subMenuData[0].path ? route.subMenuData[0].path : `${route.subMenuData[0].key}`
      }
    }
  } else {
    if (route?.isOnlyRouting) {
      const menu: any = {}
      return menu
    } return {
      key: `${route?.menuId ? route?.menuId : route?.subMenuId}`,
      icon: renderIcon(route.iconType, route.iconName),
      name: route.title,
      path: route.path
    }
  }
}

const getRoute = (route) => {
  if (route && route.subMenuData && route.subMenuData.length) {
    return route.subMenuData.map(item => getRoute(item))
  } else if (route && route.subMenuChildren && route.subMenuChildren.length && route.subMenuChildren.length >= 1) {
    return route.subMenuChildren.map(item => getRoute(item))
  } else {
    const additionalProps = { scopes: route.scopes };
    const componentToRender = components[route.componentName]
    return <Route
      key={`${route?.menuId ? route?.menuId : route?.subMenuId}`}
      path={`/${route.path}`}
      element={componentToRender ? componentToRender(additionalProps) : componentToRender} />
  }
}


export const CustomProLayout = (props: CustomProLayoutProps) => {
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(false);
  const [sideBar, setSideBar] = useState(true);

  const navigate = useNavigate();
  const {
    token: { colorPrimary, colorBgBase },
  } = useToken();
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  const userBranchPermissions = IAMClientAuthContext?.user?.branchChildren


  const getAllRoutes = () => {
    const subMenus: any[] = [];
    const menus = IAMClientAuthContext.menuAccessObject ? IAMClientAuthContext.menuAccessObject : [];
    menus.forEach(eachRoutes => {
      const abc = getRoute(eachRoutes);
      subMenus.push(abc);
    });
    return subMenus;
  }

  const getAllSubMenus = () => {
    const subMenus: MenuItem[] = [];
    const menus = IAMClientAuthContext.menuAccessObject ? IAMClientAuthContext.menuAccessObject : [];
    menus.forEach(eachRoutes => {
      const subMenu: any = getSubMenu(eachRoutes);
      subMenus.push(subMenu);
    });
    return subMenus;
  }



  const logoutHandler = () => {
    logout(dispatch);
  };

  const getSideBarData = (): any => {
    if (sideBar) {
      return {
        headerContentRender: (props) => props.layout !== 'side' && document.body.clientWidth > 1000 ? <ProBreadcrumb /> : undefined,
        layout: 'mix'
      }
    } else {
      return {
        layout: 'top'
      }
    }
  }


  const handleUnitChange = (value) => {
    dispatch({ type: ActionTypes.ASSIGN_UNIT, payload: String(value) });
    const existing = JSON.parse(localStorage.getItem('currentUser'))
    console.log(existing,"existing")
    existing.user.unitCode = value;
    existing.user.orgData.unitCode = value;
    localStorage.setItem('currentUser', JSON.stringify(existing))
  };

  console.log(IAMClientAuthContext)

  return (
    <ProConfigProvider dark={dark}>
      <div
        id="main-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          logo={
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src={SChemaxWhiteLogo} alt="Logo 1" style={{ height: '50px' }} />
              <img src={sakkuLogo} alt="Sakku Logo" style={{ height: '50px',paddingRight: '10rem' }} />
              <span style={{ height: '50px' ,width:'200px',marginBottom:'12px'}} >
              {userBranchPermissions && userBranchPermissions.length > 0 &&
                    <Select      
                      mode='multiple'
                      placeholder='Please Select Unit'
                      style={{ width: '100%' }}
                      filterOption={(input, option) =>
                        (option!.children as unknown as string)
                          .toString()
                          .toLocaleLowerCase()
                          .includes(input.toLocaleLowerCase())
                      }

                      defaultValue={IAMClientAuthContext.user.unitCode}
                      allowClear
                      showSearch
                      onChange={handleUnitChange}
                    >
                      <Option key={'all'} value={'All'}>All</Option>
                      {userBranchPermissions?.map((rec) => {
                        return <Option key={rec.unitIds} value={rec.unitIds}>
                          {rec.unitName}
                        </Option>
                      }

                      )}
                    </Select>
                }
              </span>
              <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                color:'white'
              }}>
                CENTRAL HR MANAGEMENT SYSTEM
              </span>
             

            </div>
          }
          title={''
            // <span style={{ 
            //   whiteSpace: 'nowrap', 
            //   overflow: 'hidden', 
            //   textOverflow: 'ellipsis', 
            //   maxWidth: '100%' 
            // }}>
            //   CENTRAL HR MANAGEMENT SYSTEM
            // </span>
          }
          locale="en-US"
          siderWidth={300}
          colorPrimary={colorPrimary}
          {...getSideBarData()}
          fixSiderbar
          // token={{ header: { colorBgHeader: dark ? '#ffffff' : '#001529', colorTextMenu: !dark ? '#ffffff' : '#001529', colorHeaderTitle: !dark ? '#ffffff' : '#001529', colorTextMenuSelected: colorPrimary }, sider: { colorBgMenuItemSelected: colorBgBase } }}
          className={dark ? 'dark-theme' : 'light-theme'}
          token={{
            header: {
              colorBgHeader: dark ? '#000' : '#016582',
              colorTextMenu: dark ? '#ffffff' : '#d5d5d5',
              colorHeaderTitle: !dark ? '#ffffff' : '#ffffff',
              colorTextMenuSelected: '#fff',
              colorBgMenuItemHover: '#017c99',
              colorTextMenuActive: '#fff',
            },
            sider: {
              colorBgMenuItemSelected: '#000',
              colorMenuBackground: dark ? '#000' : '#047595',
              colorTextMenu: '#fff',
              colorBgMenuItemHover: '#005f7a',
              colorTextMenuActive: "#000",
              colorTextMenuItemHover: '#000',
              colorBgCollapsedButton: '#047595',
              colorTextCollapsedButton: '#fff',
              colorTextMenuSelected: "#fff",
              // colorBgTextMenuSelected: '#000'
            },
          }}
          menu={{ request: async () => getAllSubMenus(), collapsedShowGroupTitle: true, }}
          location={{
            pathname,
          }}
          avatarProps={{
            src: userIcon,
            size: 'small',
            title: (
              <OnlineStatus>
                <Typography.Text color='grey'>{IAMClientAuthContext?.user?.userName}</Typography.Text>


              </OnlineStatus>
            ),
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'roles',
                        label: `Roles: ${IAMClientAuthContext?.user?.roles?.toString()}`,
                      },
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'logout',
                        onClick: () => {
                          logoutHandler();
                        },
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          // headerContentRender={() => {
          //   return <Flex justify='center' align='center'>
          //     <Col >
               

          //     </Col>
          //   </Flex>
          // }}
          actionsRender={(props) => {
            return [<>
              {/* <Tooltip placement="bottom" title={'Notifications'}>
                <NotificationComponent />
              </Tooltip> */}

              <a onClick={() => navigate('/memo')} style={{ cursor: 'pointer' }}>
                <img
                  src={changeImg}
                  alt="Change"
                  style={{ width: '59px', height: 'auto', marginTop: '30px', marginRight: '7px' }}
                />
              </a>

              <Tooltip placement="bottom" title={'Switch mode'}>
                {!dark ? (
                  <Button
                    size='small'
                    type="primary"
                    onClick={() => {
                      setDark(!dark);
                    }}
                    icon={<MoonFilled />}
                  />
                ) : (
                  <Button
                    size='small'
                    type="primary"
                    onClick={() => {
                      setDark(!dark);
                    }}
                    icon={<SunFilled />}
                  />
                )}
              </Tooltip>&nbsp;&nbsp;
              <Tooltip placement="bottom" title={'Switch LayOut'}>
                {sideBar ? (
                  <CreditCardOutlined
                    style={{ color: '#fff', fontSize: '20px' }}
                    onClick={async () => {
                      setSideBar((prev) => !prev);
                    }}
                  />
                ) : (
                  <LayoutOutlined
                    style={{ color: '#fff', fontSize: '20px' }}
                    onClick={async () => {
                      setSideBar((prev) => !prev);
                    }}
                  />
                )}
              </Tooltip>

              <Tooltip placement="bottom" title={'Resize Layout'}>
                <HeaderFullscreen />
              </Tooltip>
            </>]
          }}
          // menuItemRender={(item, dom) => {
          //   return (
          //     <Tooltip title={item['label'] || item['name'] || "Menu Item"}>
          //       <Link
          //         to={item['path'] || "/"}
          //         onClick={() => {
          //           setPathname(item['path'] || "/");
          //         }}
          //       >
          //         {dom}
          //       </Link>
          //     </Tooltip>
          //   );
          // }}
          menuItemRender={(item, dom) => {
            return (
              <Tooltip title={item['label'] || item['name'] || 'Menu Item'}>
                <Link
                  to={item['path'] || '/'}
                  onClick={() => {
                    setPathname(item['path'] || '/');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {(item.icon && item?.pro_layout_parentKeys?.length != 0) && (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </span>
                  )}
                  {dom}
                </Link>
              </Tooltip>
            );
          }}
          onMenuHeaderClick={() => navigate('/')}
          footerRender={() => (
            <DefaultFooter
              links={[
                {
                  key: 'click',
                  title: 'schemax',
                  href: 'https://www.schemaxtech.com/',
                },
              ]}
              copyright={`${moment().year()} Schemax Expert Techno Craft.`}
            />
          )}
        >
          <Content style={{ minHeight: '70vh' }}>
            <Routes>{getAllRoutes().map((rec) => rec)}</Routes>
          </Content>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};

export default CustomProLayout;
