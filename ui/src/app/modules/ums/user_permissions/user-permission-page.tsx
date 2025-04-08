import { Button, Card, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { UserPForm, UserPFormModel } from './user-permission-form';
import { UserPGrid } from './user-permission-grid';


export const  UserPPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [userPData, setUserPData] = useState<UserPFormModel[]>([]);

    useEffect(() => {
        getAllUserPs();
    }, []);

    const getAllUserPs = () => {
        setUserPData([new UserPFormModel(1, 1, 1)]);
    }



    const submitHandler = (req: UserPFormModel) => {
        closeButtonHandler();
        getAllUserPs();
    }

    const createButtonHandler = () => {
        setShowForm(true);
    }

    const closeButtonHandler = () => {
        setShowForm(false);
    }
    return (
        <>
            <Card title='UserPermission' extra={<Button onClick={createButtonHandler}>Create</Button>}>
                <UserPGrid userPData={userPData} />
            </Card>
            <Drawer
                title={'User Permission'}
                open={showForm}
                onClose={closeButtonHandler}
                width='50%'
            >
                <UserPForm submitHandler={submitHandler} />
            </Drawer>
        </>
    )
}

export default UserPPage