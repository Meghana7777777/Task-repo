import { Button, Card, Col, Drawer, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SubMenuForm } from './sub-menu-form';
import { SubMenuGrid } from './sub-menu-grid';
import { SubMenuDto, ApplicationsDropDownDto, ModulesDropDownDto, MenusDropdownDto, ApplicationIdReqDto, AppModuleIdReqDto, AppModuleMenuIdReqDto, SubMenuIdReqDto } from '@hrexpert/shared-models';
import { ApplicationService, ModuleService, MenuService, SubMenuService } from '@hrexpert/shared-services';
import { useIAMClientState } from '../../../common/iam-client-react';


const { Option } = Select;
const  SubMenuPage = () => {
    const { t } = useTranslation();
    const { IAMClientAuthContext } = useIAMClientState();
    const [showForm, setShowForm] = useState(false);
    const [subMenuData, setSubMenuData] = useState<SubMenuDto[]>([]);
    const [applications, setApplications] = useState<ApplicationsDropDownDto[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<number>();
    const [selectedModule, setSelectedModule] = useState<number>();
    const [selectedMenu, setSelectedMenu] = useState<number>();
    const [moduleData, setModuleData] = useState<ModulesDropDownDto[]>([]);
    const [menusData, setMenusData] = useState<MenusDropdownDto[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<SubMenuDto>();


    const applicationService = new ApplicationService();
    const moduleService = new ModuleService();
    const menuService = new MenuService();
    const subMenuService = new SubMenuService();

    useEffect(() => {
        getAllApplicationsDropDown();
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

    const getAllSubMenusByMenuModuleAndAppId = (req: AppModuleMenuIdReqDto) => {
        subMenuService.getAllSubMenusByMenuModuleAndAppId(req).then(res => {
            if (res.status) {
                setSubMenuData(res.data ? res.data : []);
            } else {
                setSubMenuData([]);
            }
        }).catch(err => {
            console.log(err)
        })
    }


    const submitHandler = (req: SubMenuDto) => {
        subMenuService.create(req).then(res => {
            if (res.status) {
                const appModuleIdReq: AppModuleMenuIdReqDto = new AppModuleMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication ? selectedApplication : 0, selectedModule ? selectedModule : 0, selectedMenu ? selectedMenu : 0);
                getAllSubMenusByMenuModuleAndAppId(appModuleIdReq);
                closeButtonHandler();
            }
        }).catch(err => {

        });


    }

    const createButtonHandler = () => {
        setSelectedRecord(new SubMenuDto(undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, selectedMenu, undefined, selectedModule, undefined, selectedApplication, undefined, true, 1))
        setShowForm(true);
    }

    const closeButtonHandler = () => {
        setSelectedRecord(undefined);
        setShowForm(false);
    }

    const editHandler = (rec: SubMenuDto) => {
        setSelectedRecord(rec);
        setShowForm(true);
    }

    const activateOrDeactivate = (rec: SubMenuDto) => {
        const req = new SubMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, rec.subMenuId)
        subMenuService.activateOrDeactivateSubMenu(req).then(res => {
            if (res.status) {
                const appModuleIdReq: AppModuleMenuIdReqDto = new AppModuleMenuIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, selectedApplication ? selectedApplication : 0, selectedModule ? selectedModule : 0, selectedMenu ? selectedMenu : 0);
                getAllSubMenusByMenuModuleAndAppId(appModuleIdReq);
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
        getAllSubMenusByMenuModuleAndAppId(appModuleIdReq)
    }

    const getTitle = () => {
        return <>
            <Row>
                <Col><h3>SubMenus</h3></Col>
                <Col offset={2} span={5} style={{paddingTop:'15px'}}>
                    <label>Applications:&nbsp;</label>
                    <Select
                        showSearch
                        allowClear
                        onChange={onApplicationChange}
                        style={{ width: '70%' }}
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
                    <Col offset={1} span={3} style={{paddingTop:'15px'}}>
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
            </Row>
        </>
    }
    return (
        <>
            <Card title={getTitle()} extra={selectedMenu && <Button onClick={createButtonHandler}>Create</Button>}>
                {selectedMenu && <>
                    <SubMenuGrid subMenuData={subMenuData} editHandler={editHandler} activateOrDeactivate={activateOrDeactivate} />
                    <Drawer
                        title={'Sub Menu'}
                        open={showForm}
                        onClose={closeButtonHandler}
                        width='50%'
                        key={Date.now()}
                    >
                        <SubMenuForm submitHandler={submitHandler} initialValues={selectedRecord} subMenuData={subMenuData} />
                    </Drawer>
                </>}
            </Card>
        </>
    )
}

export default SubMenuPage