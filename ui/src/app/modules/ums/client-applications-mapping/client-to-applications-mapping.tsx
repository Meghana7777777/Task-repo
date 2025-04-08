
import { GetAllOrganizations, GetAllApplicationsDto, GetAllUnitDto, OrganizationReqDto, ApplicationIdReqDto, ClientAppsDto, AlertMessages } from '@hrexpert/shared-models';
import { OrganizationService, ApplicationService, UnitsService, ClentAppsService } from '@hrexpert/shared-services';
import { Card, Col, Form, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ActionsEnum } from '../../../../../../libs/shared-models/src/lib/ums/ums-common';
import React, { useEffect, useState } from 'react';
import { useIAMClientState } from '../../../common/iam-client-react';

const  ClientToApplicationsMapping = () => {
  const { Option } = Select;
      const { IAMClientAuthContext } = useIAMClientState();
  const [formRef] = useForm();
  const [orgData, setOrgData] = useState<GetAllOrganizations[]>([]);
  const [applicationData, setApplicationData] = useState<GetAllApplicationsDto[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<GetAllUnitDto[]>([]);
  const [unitsData, setUnitsData] = useState<GetAllUnitDto[]>([]);
  const [assignedUnits, setAssignedUnits] = useState<GetAllUnitDto[]>([]);

  const [selectedApplication, setSelectedApplication] = useState<number>();

  const orgService = new OrganizationService();
  const service = new ApplicationService();
  const unitsServices = new UnitsService();
  const ClientApplicationsService = new ClentAppsService();

  useEffect(() => {
    getApplicationsData();
    getAllOrganizations();
  }, []);

  const getAllOrganizations = () => {
    orgService.getAllOrganizations().then(res => {
      if (res.status && res.data) {
        setOrgData(res.data);
      }
    }).catch(err => console.log(err.message, 'err message'))
  }
  const getApplicationsData = () => {
    service.getAllApplications().then((res) => {
      if (res.status && res.data) {
        setApplicationData(res.data);
      } else {
        setApplicationData([]);
      }
    });
  };

  const onApplicationsChange = (applicationId: number) => {
    setSelectedApplication(applicationId);
    getAssignedUnitsDataByApplicationId(applicationId);
  }

  const getUnitsByOrgId = (orgRqId: OrganizationReqDto) => {
    unitsServices
      .getUnitsByOrgId(orgRqId)
      .then((res) => {
        if (res.status) {
          setUnitsData(res.data ? res.data : []);
          setFilteredUnits(res.data);
        } else {
          setUnitsData([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAssignedUnitsDataByApplicationId = (applicationId: number) => {
    const req = new ApplicationIdReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, applicationId)
    ClientApplicationsService.getAllAppsByApplicationId(req).then((res) => {
      if (res.status) {
        setAssignedUnits(res.data)
        getAllFilteredUnits(res.data, unitsData)
      } else {
        setAssignedUnits([])
      }
    }).catch(err => (console.log(err, 'error message')))
  }

  const getAllFilteredUnits = (assignedUnits: ClientAppsDto[], allUnits: GetAllUnitDto[]) => {
    const unitsId = assignedUnits.map(rec => rec.unitId)
    setFilteredUnits(allUnits.filter(rec => !unitsId.includes(rec.unitId)))
  }

  const onClientsChange = (orgRqId: number) => {
    const orgIdReq: OrganizationReqDto = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, orgRqId)
    getUnitsByOrgId(orgIdReq);
  }

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, unit: GetAllUnitDto) => {
    event.dataTransfer.setData('unit', JSON.stringify(unit));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const unit: GetAllUnitDto = JSON.parse(event.dataTransfer.getData('unit'));

    if (!assignedUnits.some((mappedUnit) => mappedUnit.unitId === unit.unitId)) {
      mapOrUnMapAppsToClient(selectedApplication, unit.organizationId, undefined, ActionsEnum.CREATE, unit.unitId);

      setAssignedUnits((prevAssignedUnits) => [...prevAssignedUnits, unit]);
    }
  };

  const mapOrUnMapAppsToClient = (appsId: number, clientId: number, clientAppsId: number, actionType: ActionsEnum, unitId: number) => {
    const req: ClientAppsDto = new ClientAppsDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, clientAppsId, appsId, unitId, undefined, clientId, undefined, true, 1, actionType)
    ClientApplicationsService.mapOrUnMapAppsToClient(req).then((res) => {
      if (res.status) {
      } else {
        AlertMessages.getErrorMessage(res.internalMessage);
      }
    }).catch(err => console.log(err.message, 'error message'))
  }

  const handleAvailableDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const unit: ClientAppsDto = JSON.parse(event.dataTransfer.getData('unit'));
    mapOrUnMapAppsToClient(selectedApplication,unit.clientAppsId, unit.clientId, ActionsEnum.DELETE,unit.unitId);
  };


  return (
    <div>
      <Card title={'Client To Applications Mapping'}>
        <Form form={formRef}>
          <Row>
            <Col offset={3} span={6}>
              <Form.Item label='Clients' name={'clients'}>
                <Select onChange={onClientsChange} style={{ width: '100%' }} placeholder='Select Clients'>
                  {orgData.map(rec => {
                    return <Option value={rec.organizationId}>{rec.name}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={6} span={6}>
              <Form.Item label='Applications' name='applications'>
                <Select onChange={onApplicationsChange} style={{ width: '100%' }} placeholder='Select Applications'>
                  {applicationData.map(rec => {
                    return <Option value={rec.applicationId}>{rec.applicationName}</Option>
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <br />
        <div style={{ height: '90vh' }}>
          <Row>
            <Col offset={3} span={6}>
              <Card title='Branches' style={{ height: '90vh', width: 300, marginRight: 20 }}
                onDragOver={handleDragOver}
                onDrop={handleAvailableDrop}>
                {filteredUnits?.map((comment, index) => (
                  <Card
                    key={comment.unitId}
                    style={{ background: '#f7c78d', marginBottom: '10px' }}
                    draggable
                    onDragStart={(event) => handleDragStart(event, comment)}
                  >
                    <span style={{ wordWrap: 'break-word' }}>
                      <li style={{ color: 'black' }}>{comment.name}</li>
                    </span>
                  </Card>
                ))}
              </Card>
            </Col>
            <Col offset={6} span={6}>
              {selectedApplication && <Card title='Assigned Branches' style={{ height: '90vh', width: 300 }}
                onDragOver={handleDragOver}
                onDrop={handleDrop}>
                {assignedUnits.map((comment, index) => (
                  <Card
                    key={comment.unitId}
                    style={{ background: '#f7c78d', marginBottom: '10px' }}
                    draggable
                  >
                    <span style={{ wordWrap: 'break-word' }}>
                      <li style={{ color: 'black' }}>{comment.name}</li>
                    </span>
                  </Card>
                ))}
              </Card>}
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  )
}

export default ClientToApplicationsMapping;
