
import { Button, Card, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { OrganizationForm } from './organiation-form';
import { OrganizationGrid } from './organization-grid';
import { GetAllOrganizations } from '@hrexpert/shared-models';
import { OrganizationService } from '@hrexpert/shared-services';

const  OrganizationPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [orgData, setOrgData] = useState<GetAllOrganizations[]>([]);
    const orgService = new OrganizationService();
    const [initialValues, setInitialValues] = useState<GetAllOrganizations>();
    const [dummyRefresh, setDummyRefresh] = useState<number>(0);

    useEffect(() => {
        getAllOrganizations();
    }, []);

    const getAllOrganizations = () => {
        orgService.getAllOrganizations().then(res => {
            if (res.status && res.data) {
                setOrgData(res.data);
            }
        }).catch(err => console.log(err.message, 'err message'))
    }



    const createButtonHandler = () => {
        setShowForm(true);
        setDummyRefresh(prev => prev + 1);
    }

    const closeButtonHandler = () => {
        setShowForm(false);
        setDummyRefresh(prev => prev + 1);
    }
    return (
        <>
            <Card title='Client' extra={<Button onClick={createButtonHandler}>Create</Button>}>
                <OrganizationGrid getAllOrganizations={getAllOrganizations} tableData={orgData} setInitialValues={setInitialValues} createButtonHandler={createButtonHandler} />
            </Card>
            <Drawer
                title={'Client'}
                open={showForm}
                onClose={closeButtonHandler}
                width='50%'
                key={dummyRefresh}
            >
                <OrganizationForm key={dummyRefresh} closeButtonHandler={closeButtonHandler} getAllOrganizations={getAllOrganizations} initialValues={initialValues} />
            </Drawer>
        </>
    )
}

export default OrganizationPage