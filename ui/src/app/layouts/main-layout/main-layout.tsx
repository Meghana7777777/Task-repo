import { blue } from '@ant-design/colors'
import { ContainerOutlined, DollarOutlined, FileTextOutlined, FolderAddOutlined, FolderViewOutlined, GroupOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined, MoonFilled, PicLeftOutlined, SnippetsOutlined, SunFilled, UserOutlined } from '@ant-design/icons'
import { ProConfigProvider } from '@ant-design/pro-components'
import ProLayout, { DefaultFooter, ProBreadcrumb } from '@ant-design/pro-layout'
import { Avatar, Button, Dropdown, theme, Tooltip, Typography } from 'antd'
import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import SChemaxShortLightLogo from '../../../assets/images/schemax-short-logo-light.png'
const { useToken } = theme
export default function MainLayout() {
  const navigate = useNavigate()
  const tempRoutes = [
    {
      path: '/',
      name: 'Home',
      icon: <HomeOutlined />,
    },

    {
      path: '/master',
      name: 'Master',
      icon: <GroupOutlined />,
      routes: [
        {
          name: 'Employee Type',
          path: '/master/employee-type-view'
        },
        {
          name: 'Branches',
          path: '/master/Branches-view',
        },
        {
          name: 'Division',
          path: '/master/division-grid'
        },
        {
          name: 'Departments',
          path: '/master/departments-view'
        },
        {
          name: 'Designations',
          path: '/master/designations-grid',
        },
        {
          name: "Relations",
          path: "/master/relations-view"
        },
        {
          name: "Types Of Leaves",
          path: "/master/types-of-leaves-view"
        },

        {
          name: 'Shifts',
          path: '/master/shift-view',
        },

        {
          name: 'attendance-status',
          path: '/master/attendance-status-view',
        },

        {
          name: 'Skills',
          path: '/master/skills-grid',
        },
        {
          name: 'Qualifications',
          path: '/master/qualifications-grid',
        },
        {
          name: 'Id Proof',
          path: '/master/id-proof-view'
        },
        {
          name: 'Leave Group',
          path: '/master/Leave-groups'
        },


        {
          name: 'Holiday Calendar',
          path: '/master/holiday-view'
        },
        // {
        //   name: 'Over Time',
        //   path: '/master/apply-ot-grid'
        // },
        // {
        //   name: 'Payroll Types',
        //   path: '/master/payroll-types-view'
        // },
        // {
        //   name: 'Attendance Device',
        //   path: '/master/attendance-device-grid'
        // },
        {
          name: 'Branches Mapping',
          path: '/master/branches-mapping-grid'
        },
      ]
    },
    {
      name: 'Resource Management',
      path: '/employee-management',
      icon: <UserOutlined />,
      routes: [
        {
          name: 'Add Employee',
          path: '/employee-management/employee-form'
        },
        {
          name: 'Employees',
          path: '/employee-management/employee-view'
        },
        {
          name: 'Update Reporting Manager',
          path: '/employee-management/employee-rm-update'
        },
        // {
        //   name: 'Employee Logs',
        //   path: '/employee-management/employee-logs'
        // }
        {
          name: 'Employee Resignation Proofs',
          path: '/employee-management/employee-resignation-view'
        }
      ]
    },
    {
      path: '/Attendance-management',
      name: 'Attendance Management',
      icon: <SnippetsOutlined />,
      routes: [
        {
          name: 'Allocate Week-Off',
          path: 'week-off-leave-grid'
        },

        {
          name: 'Attendance Adjustment ',
          path: 'attendance-adjustment'
        },
        {
          name: 'Attendance Adjustment Bulk',
          path: 'attendance-adjustment-bulk'
        },

        {
          name: 'Attendance Approval ',
          path: 'attendance-aprroval'
        },

        {
          name: 'Apply CO - OD ',
          path: 'apply-co-od-upload-view'
        },

        {
          name: 'OT Apply',
          path: 'ot-approval'
        },
        {
          name: 'OT Approval',
          path: 'ot-approved'
        },

        // {
        //   name: 'Bulk OT Approval',
        //   path: '/leave-management/ot-approval'
        // },
        // {
        //   name: 'Shift Group Calender',
        //   path: '/leave-management/team-calender'
        // },
        // {
        //   name: 'Shift Change Request',
        //   path: '/leave-management/shift-change'
        // },{
        //   name: 'Shift Change Approve',
        //   path: '/leave-management/shift-change-view'
        // },
        // {
        //   name: 'Employee Shift Mapping',
        //   path: '/leave-management/shift-mapping'
        // },


      ]
    },
    {
      path: '/leave-management',
      name: 'Leave Management',
      icon: <PicLeftOutlined />,
      routes: [


        {
          name: 'Leave Policy',
          path: '/leave-management/leave-policy-configuration'
        },

        {
          name: 'Leave Allocation',
          path: '/leave-management/leave-allocation-view'
        },

        // {
        //   name: 'Bulk OT Approval',
        //   path: '/leave-management/ot-approval'
        // },
        //
        // {
        //   name: 'Shift Change Request',
        //   path: '/leave-management/shift-change'
        // },
        // {
        //   name: 'Shift Change Approve',
        //   path: '/leave-management/shift-change-view'
        // },
        // {
        //   name: 'Employee Shift Mapping',
        //   path: '/leave-management/shift-mapping'
        // },
        {
          name: 'Leave Apply',
          path: '/leave-management/apply-for-leaves-mannual-form'
        },
        {
          name: 'Approve Leaves',
          path: '/leave-management/approve-leaves'
        },
        // {
        //   name: 'Over Time',
        //   path: '/master/apply-ot-grid'
        // },
        // {
        //   name: 'Attendance Device',
        //   path: '/master/attendance-device-grid'
        // }
        //   name: 'Attendance Adjustment Approval ',
        //   path: '/leave-management/attendance-adjustment-approval'
        // },

        // {
        //   name: 'Leave Adjustment ',
        //   path: '/leave-management/leave-adjustment-view'
        // },

        {
          name: "Leave Adjustment",
          path: '/leave-management/leave-adjustment-form'
        },
      ]
    },
    {
      path: '/employee-directory',
      name: 'Employee Directory',
      icon: <IdcardOutlined />,
      routes: [
        {
          name: 'Employee Documents',
          path: '/employee-directory/employee-id-proofs'
        },
      ]
    },
    {
      path: '/payroll-management',
      name: 'Payroll Management',
      icon: <DollarOutlined />,
      routes: [
        {
          name: 'Payroll Types',
          path: '/payroll-management/payroll-types-view'
        },
        {
          name: 'Payroll Type Component Mapping',
          path: '/payroll-management/payroll-type-components-mapping'
        },
        {
          name: 'Payroll Component',
          path: '/payroll-management/payroll-components-grid'
        },
        {
          name: 'Payroll Head Count',
          path: '/payroll-management/payroll-headcount-report'
        },
        {
          name: 'Employee Recurring Component',
          path: '/payroll-management/payroll-emp-recurring-component'
        },
        {
          name: 'Employee Non Recurring',
          path: '/payroll-management/employee-non-recurring'
        },
        {
          name: 'Payroll Generatation',
          path: '/payroll-management/generate-payroll'
        },
        {
          name: 'Employee Payroll Components',
          path: '/payroll-management/employee-payroll-components'
        },
        {
          name: 'Day Wise Wage Upload',
          path: '/payroll-management/day-wise-pay-upload'
        },
        {
          name: 'Payroll Processed Log',
          path: '/payroll-management/payroll-processed-log-report'
        },
        {
          name: 'Payroll HOD Approval',
          path: '/payroll-management/hod-approval-screen'
        },
        {
          name: 'Payroll Component Wise Report',
          path: '/payroll-management/payroll-component-wise-report'
        },
        {
          name: 'Non Recurring Report',
          path: '/payroll-management/employee-non-recurring-report'
        },
        {
          name: 'Payslip Generation',
          path: '/payroll-management/payslip-generation'
        },
        {
          name: 'Employee Loan Salary Form',
          path: '/payroll-management/payroll-emp-loan-salary'
        },
        {
          name: 'Bank Reconciliation Report',
          path: '/payroll-management/bank-reconciliation-report'
        },
        {
          name: 'Mess Extra Days Upload',
          path: '/payroll-management/mess-extradays-upload'
        },
        {
          name: 'Payroll Checklist',
          path: '/payroll-management/payroll-checklist'
        }
      ]
    },



    // {
    //   path: '/leave-management',
    //   name: 'Leave Management',
    //   icon: <></>,
    //   routes: [




    //     // {
    //     //   name: 'Leave Adjustment ',
    //     //   path: '/leave-management/leave-adjustment-view'
    //     // },

    //     // {
    //     //   name: 'OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },

    //     // {
    //     //   name: 'Bulk OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },
    //     // {
    //     //   name: 'Shift Group Calender',
    //     //   path: '/leave-management/team-calender'
    //     // },
    //     // {
    //     //   name: 'Shift Change Request',
    //     //   path: '/leave-management/shift-change'
    //     // },{
    //     //   name: 'Shift Change Approve',
    //     //   path: '/leave-management/shift-change-view'
    //     // },
    //     // {
    //     //   name: 'Employee Shift Mapping',
    //     //   path: '/leave-management/shift-mapping'
    //     // },



    //   ]
    // },

    // {
    //   path: '/Attendance-management',
    //   name: 'Attendance Management',
    //   icon: <></>,
    //   routes: [
    //     {
    //       name: 'Allocate Week-Off',
    //       path: '/master/week-off-leave-grid'
    //     },

    //     {
    //       name: 'Attendance Adjustment ',
    //       path: '/leave-management/attendance-adjustment'
    //     },

    //     {
    //       name: 'Attendance Approval ',
    //       path: '/leave-management/attendance-aprroval'
    //     },

    //     {
    //       name: 'Apply CO - OD ',
    //       path: '/leave-management/apply-co-od-upload-view'
    //     },

    //     // {
    //     //   name: 'OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },

    //     // {
    //     //   name: 'Bulk OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },
    //     // {
    //     //   name: 'Shift Group Calender',
    //     //   path: '/leave-management/team-calender'
    //     // },
    //     // {
    //     //   name: 'Shift Change Request',
    //     //   path: '/leave-management/shift-change'
    //     // },{
    //     //   name: 'Shift Change Approve',
    //     //   path: '/leave-management/shift-change-view'
    //     // },
    //     // {
    //     //   name: 'Employee Shift Mapping',
    //     //   path: '/leave-management/shift-mapping'
    //     // },


    //   ]
    // },
    // {
    //   path: '/leave-management',
    //   name: 'Leave Management',
    //   icon: <></>,
    //   routes: [


    //     {
    //       name: 'Leave Allocation',
    //       path: '/leave-management/leave-allocation-view'
    //     },

    //     {

    //       name: 'Apply Leave',
    //       path: '/leave-management/apply-for-leaves-grid'
    //     },

    //     {
    //       name: 'Approve Leaves',
    //       path: '/leave-management/approve-leaves'
    //     },

    //     // {
    //     //   name: 'Leave Adjustment ',
    //     //   path: '/leave-management/leave-adjustment-view'
    //     // },

    //     // {
    //     //   name: 'OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },

    //     // {
    //     //   name: 'Bulk OT Approval',
    //     //   path: '/leave-management/ot-approval'
    //     // },
    //     // {
    //     //   name: 'Shift Group Calender',
    //     //   path: '/leave-management/team-calender'
    //     // },
    //     // {
    //     //   name: 'Shift Change Request',
    //     //   path: '/leave-management/shift-change'
    //     // },{
    //     //   name: 'Shift Change Approve',
    //     //   path: '/leave-management/shift-change-view'
    //     // },
    //     // {
    //     //   name: 'Employee Shift Mapping',
    //     //   path: '/leave-management/shift-mapping'
    //     // },



    //   ]
    // },

    {
      name: 'Reports',
      path: '/reports',
      icon: <FileTextOutlined />,
      routes: [
        {
          name: 'Emp RM Un Assigned Report',
          path: '/reports/RM-un-assigned-emp-report'
        },
        {
          name: 'Attendance Report',
          path: '/reports/attedance-report'
        },
        {
          name: "Month Wise Employee Report",
          path: '/reports/month-wise-employee-report'
        },
        {
          name: "Week Wise Employee Report",
          path: '/reports/Week-wise-employee-report'
        },
        // {
        //   name: "Extra Work Hours",
        //   path: '/reports/extra-work-hours'
        // },
        // {
        //   name: "Employee Attendance Scorecard",
        //   path: '/reports/employee-attendance-scorecard'
        // },
        // {
        //   name: "Manual Attendance Modifications",
        //   path: '/reports/attendance-modifications-report'
        // },
        {
          name: "Attendance Misleanious",
          path: '/reports/attendance-mislenious-report'
        },
        {
          name: "Reference-employee-data",
          path: '/reports/reference-employees-report'
        },


        // {
        //   name: 'Absent Report',
        //   path: '/reports/absent-report'
        // },

        // {
        //   name: 'OT Approval',
        //   path: '/reports/ot-approval-report'
        // },

        // {
        //   name: 'Bank Payment',
        //   path: '/reports/bank-payment-report'
        // },
        // {
        //   name: 'employee working hours',
        //   path: '/reports/working-hours'
        // },
        {
          name: 'Late Minutes Report',
          path: '/reports/late-minutes-report'
        },

        {
          name: 'Leave Balance Report',
          path: '/reports/leave-balance-report'
        },

        // {
        //   name: "Extra Work Hours",
        //   path: '/reports/extra-work-hours'
        // },
        // {
        //   name: "Employee Attendance Scorecard",
        //   path: '/reports/employee-attendance-scorecard'
        // },
        // {
        //   name: "Manual Attendance Modifications",
        //   path: '/reports/attendance-modifications-report'
        // },
        // {
        //   name: "Attendance Misleanious",
        //   path: '/reports/attendance-mislenious-report'
        // }
        {
          name: 'Leave Collision Report',
          path: '/reports/leave-collision-report'
        },
      ]
    },
    {
      path: '/employee-forms',
      name: 'Statutory Handovers',
      icon: <ContainerOutlined />,
      routes: [
        {
          name: 'Forms',
          path: '/employee-forms/forms'
        },
        {
          name: 'Tour Intimation',
          path: '/employee-forms/tour-intimation'
        },
        {
          name: 'Tour Intimation-users',
          path: '/employee-forms/tour-intimation-users'
        },
      ]
    },

    {
      name: 'Self  Service Portal',
      path: '/self-service-portal',
      icon: <FileTextOutlined />,
      routes: [
        // {
        //   name: 'View My Attendance',
        //   path: '/self-service-portal/working-hours'
        // },
        // {
        //   name: "Leave Balance History",
        //   path: '/self-service-portal/leave-balance-history'
        // },
        // {
        //   name: "Self Apply Leave ",
        //   path: '/self-service-portal/self-leave-apply-form'
        // },
        // {
        //   name: "View Attedance ",
        //   path: '/self-service-portal/self-service-view-attedance'
        // },
        // {
        //   name: 'Shift Change Request',
        //   path: '/self-service-portal/shift-change-request'
        // }
        {
          name: "Personal Infromation",
          path: "/self-service-portal/personal-infromation-management-view"
        },
        {
          name: "RM Employees Report",
          path: "/self-service-portal/absent-report-rm"
        }
      ]
    },
    // {
    //   name: 'Self  Service Portal',
    //   path: '/self-service-portal',
    //   icon: <FileTextOutlined />,
    //   routes: [
    //     {
    //       name: 'View My Attendance',
    //       path: '/self-service-portal/working-hours'
    //     },
    //     {
    //       name: "Leave Balance History",
    //       path: '/self-service-portal/leave-balance-history'
    //     },
    //     {
    //       name: "Self Apply Leave ",
    //       path: '/self-service-portal/self-leave-apply-form'
    //     },
    //     {
    //       name: "View Attedance ",
    //       path: '/self-service-portal/self-service-view-attedance'
    //     },
    //      {
    //       name:"Leave Adjustment",
    //       path: '/leave-management/leave-adjustment-form'
    //      },
    //   ]
    // },


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
