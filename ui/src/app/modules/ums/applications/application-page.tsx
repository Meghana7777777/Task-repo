import React, { useEffect, useState } from 'react';
import { Card, Button, Drawer } from 'antd';
import { ApplicationGrid } from './application-grid';
import { ApplicationForm } from './application-form';
import { GetAllApplicationsDto } from '@hrexpert/shared-models';
import { ApplicationService } from '@hrexpert/shared-services';




export const ApplicationPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [applicationData, setApplicationData] = useState<GetAllApplicationsDto[]>([]);
  const [initialValues, setInitialValues] = useState<GetAllApplicationsDto>();
  const [dummyRefresh, setDummyRefresh] = useState<number>(0)


  const service = new ApplicationService();

  useEffect(() => {
    getApplicationsData();
  }, []);

  const getApplicationsData = () => {
    service.getAllApplications().then((res) => {
      if (res.status && res.data) {
        setApplicationData(res.data);
      } else {
        setApplicationData([]);
      }
    }).catch(err => {
      console.log(err)
    })
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
      <Card title="Applications" extra={<Button onClick={createButtonHandler}>Create</Button>}>
        <ApplicationGrid setInitialValues={setInitialValues} createButtonHandler={createButtonHandler} applicationData={applicationData} getAllApplicationsData={getApplicationsData} />
      </Card>
      <Drawer
        title="ApplicationForm"
        open={showForm}
        onClose={closeButtonHandler}
        width="50%"
        key={dummyRefresh}
      >
        <ApplicationForm key={dummyRefresh} getAllApplicationsData={getApplicationsData} initialValues={initialValues} closeButtonHandler={closeButtonHandler} />
      </Drawer>
    </>
  );
};

export default ApplicationPage;
