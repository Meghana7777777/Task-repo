import { blue } from '@ant-design/colors'
import { FileTextOutlined, FolderAddOutlined, FolderViewOutlined, GroupOutlined, HomeOutlined, LogoutOutlined, MoonFilled, SunFilled, UserOutlined, PicLeftOutlined, IdcardOutlined, UserAddOutlined, UserDeleteOutlined, UserSwitchOutlined, UsergroupAddOutlined, HistoryOutlined } from '@ant-design/icons'
import { ProConfigProvider } from '@ant-design/pro-components'
import ProLayout, { DefaultFooter, ProBreadcrumb } from '@ant-design/pro-layout'
import { Avatar, Button, Dropdown, theme, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import SChemaxShortLightLogo from '../../../assets/images/schemax-short-logo-light.png'
const { useToken } = theme
export default function SelfServicePortalMainLayout() {
    const navigate = useNavigate()
    const tempRoutes = [
        {
            path: '/',
            name: 'My Profile',
            icon: <HomeOutlined />,
        },

        {
            name: 'View My Attendance',
            path: '/self-service-portal/working-hours',
            icon: <UserAddOutlined />
        },
        {
            name: "Leave Balance History",
            path: '/self-service-portal/leave-balance-history',
            icon: <HistoryOutlined />,
        },
        {
            name: "Self Apply Leave ",
            path: '/self-service-portal/self-leave-apply-form',
            icon: <UserDeleteOutlined />,
        },
        {
            name: "View Attedance ",
            path: '/self-service-portal/self-service-view-attedance',
            icon: <UsergroupAddOutlined />,
        },
        {
            name: 'Shift Change Request',
            path: '/self-service-portal/shift-change-request',
            icon: <UserSwitchOutlined />,
        },
        {
            name: 'Payslip',
            path: '/self-service-portal/pay-slip-view',
            icon: <UserSwitchOutlined />,
        }


    ]
    function getCommonIcon(name: string) {
        if (name == 'Create') {
            return <FolderAddOutlined />;
        }
        if (name == 'View') {
            return <FolderViewOutlined />;
        }
        return <></>;
    }
    const [dark, setDark] = useState(false);
    const location = useLocation();
    const [pathname, setPathname] = useState(location.pathname);
    console.log(location.pathname);
    const [sideBar, setSideBar] = useState(true);

    const {
        token: { colorPrimary, colorBgBase },
    } = useToken();
    const [menuObj, setMenuObj] = useState<any>({
        path: '/',
        routes: tempRoutes,
    });

    function logoutHandler() {
        localStorage.clear();
        navigate("/login", { replace: true })
    }

    const getTitle = () => {
        let title = 'Not Found';

        // Loop through the parent routes
        menuObj.routes.forEach((parentRoute: any) => {
            // Check if the parent route matches the location.pathname
            if (parentRoute.path === location.pathname) {
                title = parentRoute.name; // Return the parent name if it matches
            } else if (parentRoute.routes) {
                // If there are nested routes, loop through them
                // console.log(location.pathname, 'path name', 'routes', parentRoute.routes)

                const matchingChildRoute = parentRoute.routes.find(
                    (childRoute: any) => childRoute.path === location.pathname
                );

                if (matchingChildRoute) {
                    title = parentRoute.name; // Return the parent name if a child route matches
                }
            }
        });

        return title;
    };

    return (
        <ProConfigProvider dark={dark}>
            <ProLayout
                locale="en-US"
                token={{
                    header: {
                        colorBgHeader: dark ? blue[9] : blue[0],
                        colorTextMenu: dark ? '#ffffff' : '#d5d5d5',
                        colorHeaderTitle: dark ? '#fff' : '#000',
                        colorTextMenuSelected: '#fff',
                        colorBgMenuItemHover: '#017c99',
                        colorTextMenuActive: '#fff',
                    },
                    sider: {
                        colorBgMenuItemSelected: dark ? '#232323' : '#f3f3f3',
                        colorMenuBackground: dark ? '#171717' : '#fff',
                        colorTextMenu: dark ? '#fff' : '#171717',
                        colorBgMenuItemHover: dark ? '#232323' : '#f3f3f3',
                        colorTextMenuItemHover: '#1890ff',
                        colorTextMenuActive: '#1890ff',
                        colorTextMenuSelected: '#1890ff',
                        colorBgCollapsedButton: '#fff',
                        colorTextCollapsedButton: dark ? '#fff' : '#171717',
                    },
                    // bgLayout: dark ? '#171717' : '#fffff',

                }}
                logo={<img src={SChemaxShortLightLogo} />}
                title={'HR EXPERT'}
                layout="mix"
                route={menuObj}
                location={{
                    pathname,
                }}
                menu={{ type: 'group' }}
                menuItemRender={(item, dom) => {

                    return (
                        <Link
                            to={item?.path || '/'}
                            onClick={() => {
                                setPathname(item.path || '/');
                            }}
                        >
                            {dom}
                        </Link>
                    );
                }}
                menuExtraRender={({ collapsed }) =>
                    !collapsed && (
                        <div>
                            <Typography.Title level={3}>{getTitle()}</Typography.Title>
                        </div>
                    )
                }
                headerContentRender={() => {
                    return <ProBreadcrumb />;
                }}
                footerRender={() => (
                    <DefaultFooter
                        copyright="2024 powered by Schemax tech"
                        links={[
                            {
                                key: 'SchemaX Tech',
                                title: 'SchemaX Tech',
                                href: 'https://www.schemaxtech.com/',
                                blankTarget: true,
                            },
                        ]}
                    />
                )}
                actionsRender={(props) => {
                    return [
                        <Tooltip placement="bottom" title={'Switch mode'}>
                            {dark ? (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setDark(!dark);
                                    }}
                                    icon={<MoonFilled />}
                                />
                            ) : (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setDark(!dark);
                                    }}
                                    icon={<SunFilled />}
                                />
                            )}
                        </Tooltip>,
                        //   <Tooltip placement="bottom" title={"Switch LayOut"}>
                        //     {sideBar ?
                        //       <Button icon={<CreditCardOutlined style={{ color: '#fff', fontSize: '20px' }} onClick={async () => { setSideBar(prev => !prev); }} /> }/>

                        //       : <LayoutOutlined style={{ color: '#fff', fontSize: '20px' }} onClick={async () => { setSideBar(prev => !prev); }} />}
                        //     <Button size="large" type='primary' onClick={async () => { setSideBar(prev => !prev); }} icon={ sideBar ? <PicLeftOutlined /> : <LayoutOutlined style={{ color: '#22C55E' }} /> }></Button>
                        // </Tooltip>
                        //     <Tooltip placement="bottom" title={"Resize Layout"}>
                        //       <HeaderFullscreen />
                        //     </Tooltip>
                    ];
                }}
                avatarProps={{
                    src: (
                        <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
                            U
                        </Avatar>
                    ),
                    size: 'small',
                    // title: <OnlineStatus ><span style={{ color: !dark ? '#ffffff' : '#001529' }}>{'ADMIN'}</span></OnlineStatus>,
                    render: (props, dom) => {
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'roles',
                                            label: `Roles: ${'ADMIN'}`,
                                        },
                                        {
                                            key: 'logout',

                                            icon: <LogoutOutlined />,
                                            label: 'logout',
                                            onClick: () => {
                                                logoutHandler();
                                            },
                                            type: 'item',
                                        },
                                    ],
                                }}
                            >
                                {dom}
                            </Dropdown>
                        );
                    },
                }}
            >
                <Outlet />
            </ProLayout>
        </ProConfigProvider>
    );
}
