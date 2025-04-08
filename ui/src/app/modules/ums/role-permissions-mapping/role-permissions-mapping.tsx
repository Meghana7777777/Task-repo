
import { ApplicationsDropDownDto, SubMenuPermissionDto, OrganizationReqDto, UnitIdDto, RolePermissionDto, PermissionsDto, RolesIdReqDto, AlertMessages, RolePermDto, AppModuleSubMenuIdReqDto } from "@hrexpert/shared-models";
import { ApplicationService, PermissionService, RolesService, UnitsService, RolePermissionsService, OrganizationService } from "@hrexpert/shared-services";
import { Card, Checkbox, Col, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useIAMClientState } from "../../../common/iam-client-react";


const { Option } = Select;

export const RolePermissionsMapping = () => {
    const { IAMClientAuthContext } = useIAMClientState();
    const [applications, setApplications] = useState<ApplicationsDropDownDto[]>([]);
    const [selectedApplication, setSelectedApplication] = useState<number>();
    const [applicationPermissions, setApplicationPermissions] = useState<SubMenuPermissionDto[]>([]);
    const [selectedMenuPermission, setSelectedMenuPermission] = useState<SubMenuPermissionDto>()

    const [clients, setClients] = useState<any[]>([]);
    const [selectedClients, setSelectedClients] = useState<number>();
    const [unitsData, setUnitsData] = useState<any[]>([]);
    const [selectedUnits, setSelectedUnits] = useState<number>();
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<number>();

    const [rolePermission, setRolePermission] = useState<SubMenuPermissionDto[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<any[]>([]);


    const applicationService = new ApplicationService();
    const permissionService = new PermissionService();
    const rolesService = new RolesService();
    const unitsServices = new UnitsService();
    const rolePermissionService = new RolePermissionsService();
    const organizationService = new OrganizationService();

    useEffect(() => {
        getAllApplicationsDropDown();
        getAllOrganizations();
    }, []);

    const getAllApplicationsDropDown = () => {
        applicationService.getAllApplicationsDropDown().then(res => {
            if (res.status) {
                setApplications(res.data ? res.data : []);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    const getAllOrganizations = () => {
        organizationService
            .getAllOrganizationsDropdown()
            .then((res) => {
                if (res.status) {
                    setClients(res.data ? res.data : []);
                } else {
                    setClients([]);
                }
                setSelectedClients(undefined);
                setSelectedUnits(undefined);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getUnitsByOrgId = (orgRqId: OrganizationReqDto) => {
        unitsServices
            .getUnitsByOrgId(orgRqId)
            .then((res) => {
                if (res.status) {
                    setUnitsData(res.data ? res.data : []);
                } else {
                    setUnitsData([]);
                }
                setSelectedUnits(undefined);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const getAllRolesByUnitId = (unitsRqId: UnitIdDto) => {
        rolesService
            .getAllRolesByUnitId(unitsRqId)
            .then((res) => {
                if (res.status) {
                    setRoles(res.data);
                } else {
                    setRoles([])
                }
                setSelectedRoles(undefined)
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const processRolePermissionToMenus = (perms: RolePermissionDto[]) => {
        const menuToPermissionsMap: Map<number, SubMenuPermissionDto> = new Map();
        perms.forEach(rec => {
            const perm = new PermissionsDto(rec.username, rec.userId, rec.permissionId, rec.permission, rec.subMenuId, rec.subMenu, rec.scopeId, rec.scope, 1, true, undefined, undefined, undefined, undefined)
            if (menuToPermissionsMap.has(rec.subMenuId)) {
                menuToPermissionsMap.get(rec.subMenuId).permissions.push(perm);
            } else {
                menuToPermissionsMap.set(rec.subMenuId, new SubMenuPermissionDto(rec.subMenuId, rec.subMenu, [perm]));
            }
        })
        return Array.from(menuToPermissionsMap.values())
    }

    const getRolePermissionByRoleId = (roleIdRq: RolesIdReqDto) => {
        rolePermissionService
            .getRolePermissionByRoleId(roleIdRq)
            .then((res) => {
                if (res.status) {
                    setRolePermission(processRolePermissionToMenus(res.data));
                } else {
                    setRolePermission([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onClientChange = (orgId: number) => {
        setSelectedClients(orgId);
        const orgRqId: OrganizationReqDto = new OrganizationReqDto(
            IAMClientAuthContext.user.userName,
            IAMClientAuthContext.user.userId,
            orgId
        );
        getUnitsByOrgId(orgRqId);
    };

    const onUnitsChange = (unitId: number) => {
        setSelectedUnits(unitId);
        const unitsRqId: UnitIdDto = new UnitIdDto(
            IAMClientAuthContext.user.userName,
            IAMClientAuthContext.user.userId,
            unitId
        );
        getAllRolesByUnitId(unitsRqId);
    };

    const onRolesChange = (roleId: number) => {
        setSelectedRoles(roleId);
        const roleIdRq: RolesIdReqDto = new RolesIdReqDto(
            IAMClientAuthContext.user.userName,
            IAMClientAuthContext.user.userId,
            roleId
        );
        getRolePermissionByRoleId(roleIdRq);
    };


    const handleCardClick = (item: SubMenuPermissionDto) => {
        if (rolePermission.length > 0) {
            const available = rolePermission?.filter(rec => rec?.menuId == item?.menuId);
            if (available && available[0])
                setSelectedCheckboxes(available[0]?.permissions.map(rec => rec.permissionId));
        }
        if (!selectedRoles) {
            // Show an alert message if no roles have been selected
            AlertMessages.getErrorMessage("Please select a role before selecting permissions!");
            return;
        }
        setShowModal(true);
        setSelectedMenuPermission(item);
    };

    const handleCheckboxChange = (item: any) => {
        setSelectedCheckboxes((prevSelectedCheckboxes) => {
            const updatedCheckboxes = new Set(prevSelectedCheckboxes);
            if (updatedCheckboxes.has(item)) {
                updatedCheckboxes.delete(item);
            } else {
                updatedCheckboxes.add(item);
            }
            return Array.from(updatedCheckboxes);
        });
    };

    const mapOrUnMapRolePermissions = (roleIdRq: RolePermDto) => {
        rolePermissionService.mapOrUnMapRolePermissions(roleIdRq)
            .then((res) => {
                if (res.status) {
                    const roleIdRq: RolesIdReqDto = new RolesIdReqDto(
                        IAMClientAuthContext.user.userName,
                        IAMClientAuthContext.user.userId,
                        selectedRoles
                    );
                    getRolePermissionByRoleId(roleIdRq);
                    setSelectedCheckboxes([]);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleModalCancel = () => {
        setShowModal(false)
        const roleIdRq: RolePermDto = new RolePermDto(selectedMenuPermission.menuId, selectedRoles, selectedCheckboxes)
        mapOrUnMapRolePermissions(roleIdRq);
    };

    const onApplicationChange = (appId: number) => {
        setSelectedApplication(appId);
        const req: AppModuleSubMenuIdReqDto = new AppModuleSubMenuIdReqDto(IAMClientAuthContext.user.userName,
            IAMClientAuthContext.user.userId, appId, undefined, undefined)
        getAllPermsBySubMenuModuleAndAppId(req);
    }

    const processPermissionsToMenus = (perms: PermissionsDto[]) => {
        const menuToPermissionsMap: Map<number, SubMenuPermissionDto> = new Map();
        perms.forEach(rec => {
            if (menuToPermissionsMap.has(rec.subMenuId)) {
                menuToPermissionsMap.get(rec.subMenuId).permissions.push(rec);
            } else {
                menuToPermissionsMap.set(rec.subMenuId, new SubMenuPermissionDto(rec.subMenuId, rec.subMenu, [rec]));
            }
        })
        return Array.from(menuToPermissionsMap.values())
    }

    const getAllPermsBySubMenuModuleAndAppId = (req: AppModuleSubMenuIdReqDto) => {
        permissionService.getAllPermsBySubMenuModuleAndAppId(req).then(res => {
            if (res.status) {
                setApplicationPermissions(processPermissionsToMenus(res.data))
            } else {
                setApplicationPermissions([]);
            }
        }).catch(err => {
            console.log(err.message)
        });
    }


    return (
        <>
            <Card>
                <Row>
                    <Col span={5}>
                        <label>Applications:&nbsp;</label>
                        <Select onChange={onApplicationChange} style={{ width: '100%' }} placeholder='Please Select Application'>
                            {applications.map(rec => {
                                return <Option value={rec.id}>{rec.applicationName}</Option>
                            })}
                        </Select>
                    </Col>
                    <Col offset={5} span={3}>
                        <label>Clients: </label>
                        <Select
                            onChange={onClientChange}
                            style={{ width: "100%" }}
                            placeholder="Please Select Client"
                        >
                            {clients.map((rec) => (
                                <Option value={rec.organizationId} key={rec.organizationId + "client"}>
                                    {rec.name}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    {selectedClients && (
                        <Col offset={2} span={3}>
                            <label>Branches: </label>
                            <Select
                            allowClear
                            showSearch
                                onChange={onUnitsChange}
                                style={{ width: "100%" }}
                                placeholder="Please Select Unit"
                                value={selectedUnits}
                                optionFilterProp="children"
                            >
                                {unitsData.map((rec) => (
                                    <Option value={rec.unitId} key={rec.unitId + "unit"}>
                                        {rec.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    )}
                    {selectedUnits && (
                        <Col offset={2} span={3}>
                            <label>Roles: </label>
                            <Select
                            allowClear
                            showSearch
                                onChange={onRolesChange}

                                style={{ width: "100%" }}
                                placeholder="Please Select Role"
                                value={selectedRoles}
                                 optionFilterProp="children"
                            >
                                {roles.map((rec) => (
                                    <Option value={rec.rolesId} key={rec.rolesId + "role"}>
                                        {rec.roleName}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    )}
                </Row>
                <div>
                    <Row>
                        <Col span={6}>
                            {selectedApplication && <Card title='All Application Permissions' style={{ height: "90vh", margin: "15px", width: '300px',overflowY: 'auto' }}>
                                {applicationPermissions?.map((item, index) => (
                                    <div
                                        onClick={() => handleCardClick(item)}
                                        style={{
                                            // borderStyle: "solid",
                                            // borderWidth: "2px",
                                            // borderRadius: "5px",
                                            height: "75px",
                                            width: "255px",
                                            // borderColor: "gray",
                                            textAlign: "center",
                                            backgroundColor: "#f7c78d",
                                            marginBottom: "10px",
                                            overflow: "hidden",
                                            fontSize: "6px",
                                            paddingRight: '5px',
                                            fontFamily: 'revert'
                                        }}
                                        key={index}
                                    >
                                        <h1 style={{ marginTop: "11px", color: "black" }}>
                                            {item.menuName}
                                        </h1>
                                        <Row>
                                            {item.permissions?.map((scope, index) => (
                                                <Col xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} key={index}>
                                                    <div
                                                        style={{
                                                            borderStyle: "solid",
                                                            borderWidth: "1px",
                                                            borderRadius: "5px",
                                                            height: "20px",
                                                            width: "60px",
                                                            borderColor: "darkgray",
                                                            textAlign: "center",
                                                            backgroundColor: "white",
                                                            marginLeft: "5px",
                                                            fontSize: '11px'
                                                        }}
                                                    >
                                                        {scope.scope}
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                ))}
                            </Card>}
                        </Col>
                        {selectedRoles && (<Col span={6} offset={4}>
                            <Card title='Permissions mapped to Role' style={{ height: "90vh", marginTop: '15px',width:"330px",overflowY: 'auto' }}>
                                {rolePermission.length > 0 && (
                                    <div style={{ margin: "15px" }}>
                                        {rolePermission?.map((item, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    // borderStyle: "solid",
                                                    // borderWidth: "2px",
                                                    // borderRadius: "5px",
                                                    height: "75px",
                                                    width: "255px",
                                                    // borderColor: "gray",
                                                    textAlign: "center",
                                                    backgroundColor: "#f7c78d",
                                                    marginBottom: "10px",
                                                    overflow: "hidden",
                                                    fontSize: '6px',
                                                    fontFamily: 'revert'


                                                }}
                                            >
                                                <h1 style={{ marginTop: "11px", color: "black" }}>
                                                    {item.menuName}
                                                </h1>
                                                <Row>
                                                    {item?.permissions?.map((scope: any, index: number) => (
                                                        <Col
                                                            xs={12} sm={12} md={6} lg={6} xl={6} xxl={6} key={index}
                                                        >
                                                            <div
                                                                style={{
                                                                    borderStyle: "solid",
                                                                    borderWidth: "1px",
                                                                    borderRadius: "5px",
                                                                    height: "20px",
                                                                    width: "60px",
                                                                    borderColor: "darkgray",
                                                                    textAlign: "center",
                                                                    backgroundColor: "white",
                                                                    marginLeft: "5px",
                                                                    fontSize: '11px'

                                                                    // overflowY: "auto",

                                                                }}
                                                            >
                                                                {scope.scope}
                                                            </div>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </Col>
                        )}
                    </Row>
                    <Modal open={showModal} onCancel={() => setShowModal(false)} onOk={handleModalCancel} key={selectedMenuPermission?.menuId}>
                        <Card>
                            <Row>
                                {selectedMenuPermission?.permissions?.map((scope, index) => (
                                    <Col key={scope.permissionId}>
                                        <Checkbox
                                            checked={selectedCheckboxes.includes(scope.permissionId)}
                                            onChange={() => handleCheckboxChange(scope.permissionId)}
                                            style={{ marginRight: "10px" }}
                                        />
                                        <span style={{ marginRight: "10px" }}>{scope.scope}</span>
                                    </Col>
                                ))}
                            </Row>
                        </Card>
                    </Modal>
                </div>
            </Card>
        </>
    );
};
