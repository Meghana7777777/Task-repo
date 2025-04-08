
import { Button, Card, Col, Drawer, Row, Select } from 'antd'
import { useEffect, useState } from 'react'
import { UnitForm } from './unit-form'
import { UnitGrid } from './unit-grid'
import { GetAllUnitDto, OrganizationReqDto } from '@hrexpert/shared-models'
import { OrganizationService, UnitsService } from '@hrexpert/shared-services'
import { useIAMClientState } from '../../../common/iam-client-react'

const  UnitPage = () => {
  const [initialValues, setInitialValues] = useState<GetAllUnitDto>();
  const [showForm, setShowForm] = useState(false);
  const [unitsData, setUnitsData] = useState<GetAllUnitDto[]>([]);
  const [dummyRefresh, setDummyRefresh] = useState<number>(0)
  const [selectedUnits, setSelectedUnits] = useState<number>();

  const [clients, setClients] = useState<any[]>([]);

  const { Option } = Select;
  const { IAMClientAuthContext } = useIAMClientState();
  const orgService = new OrganizationService();
  const unitsService = new UnitsService();

  useEffect(() => {
    getAllClients();
  }, []);

  const getUnitsByClientId = (orgIdReq: OrganizationReqDto) => {
    unitsService.getUnitsByOrgId(orgIdReq).then((res) => {
      if (res.status) {
        setUnitsData(res.data)
      } else {
        setUnitsData([]);
      }
    }).catch(err => {
      console.log(err.message, 'error message')
    })
  }
  const createButtonHandler = () => {
    setShowForm(true);
    setDummyRefresh(prev => prev + 1);
  }

  const closeButtonHandler = () => {
    setShowForm(false);
    setDummyRefresh(prev => prev + 1);
  }
  const getAllClients = () => {
    orgService.getAllOrganizationsDropdown().then((res) => {
      if (res.status) {
        setClients(res.data)
      } else {
        setClients([])
      }
    }).catch(err => {
      console.log(err.message, 'error message')
    })
  }
  const onClientsChange = (orgId: number) => {
    setSelectedUnits(orgId);
    const orgIdReq: OrganizationReqDto = new OrganizationReqDto(IAMClientAuthContext.user.userName, IAMClientAuthContext.user.userId, orgId)
    getUnitsByClientId(orgIdReq)
  }
  const getTitle = () => {
    return <>
      <Row>
        <Col><h3>Branches</h3></Col>
        <Col offset={2} span={5} style={{paddingTop:'15px'}}>
          <label>Clients:&nbsp;</label>
          <Select onChange={onClientsChange} style={{ width: '100%' }} placeholder='Please Select client'>
            {clients.map(rec => {
              return <Option value={rec.organizationId}>{rec.name}</Option>
            })}
          </Select>
        </Col>
      </Row>
    </>
  }
  return (
    <>
      <Card title={getTitle()} extra={selectedUnits && <Button onClick={createButtonHandler} >Create</Button>}>
        {selectedUnits && <>
          <UnitGrid unitData={unitsData} getUnitsByClientId={getUnitsByClientId} selectedUnits={selectedUnits} setInitialValues={setInitialValues} createButtonHandler={createButtonHandler} />
          <Drawer
            title={'Scope'}
            open={showForm}
            onClose={closeButtonHandler}
            width='50%'
            key={dummyRefresh}
          >
            <UnitForm key={dummyRefresh} closeButtonHandler={closeButtonHandler} initialValues={initialValues} getUnitsByClientId={getUnitsByClientId} selectedUnits={selectedUnits} />
          </Drawer>
        </>}
      </Card>
    </>
  )
}

export default UnitPage;