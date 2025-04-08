
import { Button, Card, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import AttributeForm from './attribute-form';
import { AttributeGrid } from './attribute-grid';
import { GetAllAttributeDto } from '@hrexpert/shared-models';
import { AttributeService } from '@hrexpert/shared-services';

const  AttributePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [attributeData, setAttributeData] = useState<GetAllAttributeDto[]>([]);
    const attributesService = new AttributeService();
    const [initialValues, setInitialValues] = useState<GetAllAttributeDto>();
    const [dummyRefresh, setDummyRefresh] = useState<number>(0);



    useEffect(() => {
        getAllAttributes();
    }, []);

    const getAllAttributes = () => {
        attributesService.getAllAttributes().then(res => {
            if (res.status) {
                setAttributeData(res.data);
            }
        }).catch(err => console.log(err.message, 'err message'))
    };

    const createButtonHandler = () => {
        setShowForm(true);
        setDummyRefresh(prev => prev + 1);
    };

    const closeButtonHandler = () => {
        setShowForm(false);
        setDummyRefresh(prev => prev + 1);
    };
    return (
        <>
            <Card title='Attributes' extra={<Button  onClick={createButtonHandler}>Create</Button>}>
                <AttributeGrid attributeData={attributeData} setInitialValues={setInitialValues} createButtonHandler={createButtonHandler} getAllAttributes={getAllAttributes} />
            </Card>
            <Drawer
                title={'Client'}
                open={showForm}
                onClose={closeButtonHandler}
                width='50%'
            >
                <AttributeForm key={dummyRefresh} initialValues={initialValues} getAllAttributes={getAllAttributes} closeButtonHandler={closeButtonHandler} />
            </Drawer>
        </>
    )
}

export default AttributePage;