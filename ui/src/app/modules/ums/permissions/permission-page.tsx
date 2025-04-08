import { Card, Button, Drawer, Col, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { PermForm } from './permission-form';
import { PermGrid } from './permission-grid';
import { useTranslation } from 'react-i18next';
import { ActivatePermissionDto, ApplicationIdReqDto, ApplicationsDropDownDto, AppModuleIdReqDto, AppModuleMenuIdReqDto, AppModuleSubMenuIdReqDto, MenusDropdownDto, ModulesDropDownDto, PermissionsDto, ScopesDropDownDto, SubMenuDropDownDto } from '@hrexpert/shared-models';
import { ApplicationService, ModuleService, MenuService, SubMenuService, PermissionService, ScopesService } from '@hrexpert/shared-services';
import { useIAMClientState } from '../../../common/iam-client-react';

 

const { Option } = Select;
const  PermissionsPage = () => {
    const { t } = useTranslation();
    const { IAMClientAuthContext } = useIAMClientState();
    const [showForm, setShowForm] = useState(false);
    const [permissionsData, setPermissionsData] = useState<PermissionsDto[]>([]);
    const [applications, setApplications] = useState<ApplicationsDropDownDto[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<number>();
    const [selectedModule, setSelectedModule] = useState<number>();
    const [selectedMenu, setSelectedMenu] = useState<number>();
    const [selectedSub, setSelectedSub] = useState<number>()
    const [moduleData, setModuleData] = useState<ModulesDropDownDto[]>([]);
    const [menusData, setMenusData] = useState<MenusDropdownDto[]>([]);
    const [subMenusData, setSubMenusData] = useState<SubMenuDropDownDto[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<PermissionsDto>();
    const [scopes, setScopes] = useState<ScopesDropDownDto[]>([])


    const applicationService = new ApplicationService();
    const moduleService = new ModuleService();
    const menuService = new MenuService();
    const subMenuService = new SubMenuService();
    const permissionService = new PermissionService();
    const scopesService = new ScopesService();

    useEffect(() => {
        getAllApplicationsDropDown();
        getAllScopesDropDown();
    }, []);


    const getAllApplicationsDropDown = () => {
        applicationService.getAllApplicationsDropDown().then(res => {
            if (res.status) {
                setApplications(res.data ? res.data : []);
            } else {
                setApplications([]);
            }
            setSelectedApplication(undefined);
            setSelectedModule(undefined);
            setSelectedMenu(undefined);
            setSelectedSub(undefined);
        }).catch(err => {
            console.log(err)
        })
    }


    const getAllModulesDropDownByAppId = (appIdReq: ApplicationIdReqDto) => {
        moduleService.getAllModulesDropDownByAppId(appIdReq).then(res => {
            if (res.status) {
                setModuleData(res.data ? res.data : []);
            } else {
                setModuleData([]);
            }
            setSelectedModule(undefined);
            setSelectedMenu(undefined);
            setSelectedSub(undefined);
        }).catch(err => {
            console.log(err)
        })
    }

    const getAllMenusDropDownByModuleAndAppId = (appIdReq: AppModuleIdReqDto) => {
        menuService.getAllMenusDropDownByModuleAndAppId(appIdReq).then(res => {
            if (res.status) {
                setMenusData(res.data ? res.data : []);
            } else {
                setMenusData([]);
            }
            setSelectedMenu(undefined);
        }).catch(err => {
            console.log(err)
        })
    }

    const getAllSubMenusDropDownByMenuModuleAndAppId = (req: AppModuleMenuIdReqDto) => {
        subMenuService.getAllSubMenusDropDownByMenuModuleAndAppId(req).then(res => {
            if (res.status) {
                setSubMenusData(res.data ? res.data : []);
            } else {
                setSubMenusData([]);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const submitHandler = (req: PermissionsDto) => {
        permissionService.create(req).then(res => {
            if (res.status) {
                const appModuleIdReq: AppModuleSubMenuIdReqDto = new AppModuleSubMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication ? selectedApplication : 0, selectedModule ? selectedModule : 0, selectedSub ? selectedSub : 0);
                getAllPermsBySubMenuModuleAndAppId(appModuleIdReq);
                closeButtonHandler();
            }
        }).catch(err => {
            console.log(err)
        });
    }


    const getAllPermsBySubMenuModuleAndAppId = (req: AppModuleSubMenuIdReqDto) => {
        permissionService.getAllPermsBySubMenuModuleAndAppId(req).then(res => {
            if (res.status) {
                setPermissionsData(res.data)
            } else {
                setPermissionsData([]);
            }
        }).catch(err => {
            console.log(err)
        });
    }

    const createButtonHandler = () => {
        setSelectedRecord(new PermissionsDto(undefined, undefined, undefined, undefined, selectedSub, undefined, undefined, undefined, 1, true, selectedModule, undefined, selectedApplication, undefined));
        setShowForm(true);
    }

    const closeButtonHandler = () => {
        setSelectedRecord(undefined);
        setShowForm(false);
    }

    const editHandler = (rec: PermissionsDto) => {
        const aa = { ...rec, menuId: selectedMenu }
        setSelectedRecord(aa);
        setShowForm(true);
    }

    const activateOrDeactivate = (rec: number) => {
        const req = new ActivatePermissionDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, rec);
        permissionService.activateOrDeactivatePermission(req).then(res => {
            if (res.status) {
                const appModuleIdReq: AppModuleSubMenuIdReqDto = new AppModuleSubMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication ? selectedApplication : 0, selectedModule ? selectedModule : 0, selectedSub ? selectedSub : 0);
                getAllPermsBySubMenuModuleAndAppId(appModuleIdReq);
            }
        }).catch(err => {
            console.log(err)
        })

    }

    const onApplicationChange = (appId: number) => {
        setSelectedApplication(appId);
        const appIdReq: ApplicationIdReqDto = new ApplicationIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, appId);
        getAllModulesDropDownByAppId(appIdReq);
    }

    const onModuleChange = (moduleId: number) => {
        setSelectedModule(moduleId);
        const appModuleIdReq: AppModuleIdReqDto = new AppModuleIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication, moduleId);
        getAllMenusDropDownByModuleAndAppId(appModuleIdReq)
    }

    const onMenuChange = (menuId: number) => {
        setSelectedMenu(menuId);
        const appModuleIdReq: AppModuleMenuIdReqDto = new AppModuleMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication, selectedModule, menuId);
        getAllSubMenusDropDownByMenuModuleAndAppId(appModuleIdReq)
    }

    const onSubMenuChange = (subMenuId: number) => {
        setSelectedSub(subMenuId);
        const appModuleIdReq: AppModuleMenuIdReqDto = new AppModuleMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication, selectedModule, subMenuId);
        const appModuleMenuIdReq: AppModuleSubMenuIdReqDto = new AppModuleSubMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication ? selectedApplication : 0, selectedModule ? selectedModule : 0, selectedSub ? selectedSub : 0);
        getAllPermsBySubMenuModuleAndAppId(appModuleMenuIdReq);
        getAllSubMenusDropDownByMenuModuleAndAppId(appModuleIdReq)
    }

    const getAllScopesDropDown = () => {
        scopesService.getAllScopesDropDown().then(res => {
            if (res.status && res.data) {
                setScopes(res.data);
            } else {
                setScopes([]);
            }
        }).catch(err => console.log(err.message, 'err message'))

    }

    const getTitle = () => {
        return <>
            <Row>
                <Col>
                    <h3>Permissions</h3>
                </Col>
                <Col offset={1} span={3} style={{paddingTop:'15px'}} >
                    <label>Applications:&nbsp;</label>
                    <Select
                        showSearch
                        allowClear
                        onChange={onApplicationChange}
                        style={{ width: '100%' }}
                        placeholder='Please Select Application'
                        filterOption={(input, option) =>
                            (option?.['props'].label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {applications.map(rec => (
                            <Option value={rec.id} key={rec.id + 'app'} label={rec.applicationName}>
                                {rec.applicationName}
                            </Option>
                        ))}
                    </Select>

                </Col>
                {selectedApplication && (
                    <Col offset={2} span={3} style={{paddingTop:'15px'}}>
                        <label>Modules:&nbsp;</label>
                        <Select
                            showSearch
                            allowClear
                            onChange={onModuleChange}
                            style={{ width: '100%' }}
                            placeholder='Please Select Module'
                            filterOption={(input, option) =>
                                (option?.['props'].label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            value={selectedModule}
                        >
                            {moduleData.map(rec => (
                                <Option value={rec.id} key={rec.id + 'mod'} label={rec.moduleName}>
                                    {rec.moduleName}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                )}
                {selectedModule && (
                    <Col offset={2} span={3} style={{paddingTop:'15px'}}>
                        <label>Menus:&nbsp;</label>
                        <Select
                            showSearch
                            allowClear
                            onChange={onMenuChange}
                            style={{ width: '100%' }}
                            placeholder='Please Select Module'
                           filterOption={(input, option) =>
                            (option?.['props'].label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                            value={selectedMenu}
                        >
                            {menusData.map(rec => (
                                <Option value={rec.menuId} key={rec.menuId + 'menu'} label={rec.name}>
                                    {rec.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                )}
                {selectedMenu && (
                    <Col offset={2} span={3} style={{paddingTop:'15px'}}>
                        <label>Sub Menu:&nbsp;</label>
                        <Select
                            showSearch
                            allowClear
                            onChange={onSubMenuChange}
                            style={{ width: '100%' }}
                            placeholder='Please Select Module'
                           filterOption={(input, option) =>
                            (option?.['props'].label as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                            value={selectedSub}
                        >
                            {subMenusData.map(rec => (
                                <Option value={rec.id} key={rec.id + 'submenu'} label={rec.name}>
                                    {rec.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                )}
            </Row>

        </>
    }
    return (
        <>
            <Card title={getTitle()} extra={selectedSub && <Button onClick={createButtonHandler}>Create</Button>}>
                {selectedSub && <>
                    <PermGrid permData={permissionsData} editHandler={editHandler} activateOrDeactivate={activateOrDeactivate} createButtonHandler={createButtonHandler} />
                    <Drawer
                        title={'Permissions'}
                        open={showForm}
                        onClose={closeButtonHandler}
                        width='50%'
                        key={Date.now()}
                    >
                        <PermForm submitHandler={submitHandler} initialValues={selectedRecord} scopes={scopes} />
                    </Drawer>
                </>}
            </Card>
        </>
    )
}

export default PermissionsPage;