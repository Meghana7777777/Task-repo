import { Button, Card, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { UserToAttributesForm, UserToAttributesModel } from './user-to-attribute-form';
import { UserToAttributessGrid } from './user-to-attribute-grid';

const  UserToAttributes = () => {
    const [showForm, setShowForm] = useState(false);
    const [userToAttributesData, setUserToAttributesData] = useState<UserToAttributesModel[]>([]);

    useEffect(() => {
        getAllUserToAttributes();
    }, []);

    const getAllUserToAttributes = () => {
        setUserToAttributesData([new UserToAttributesModel(1, 'abx', 'bbs', 1)]);
    }



    const submitHandler = (req: UserToAttributesModel) => {
        closeButtonHandler();
        getAllUserToAttributes();
    }

    const createButtonHandler = () => {
        setShowForm(true);
    }

    const closeButtonHandler = () => {
        setShowForm(false);
    }
    return (
        <>
            <Card title='UserToAttributes' extra={<Button onClick={createButtonHandler}>Create</Button>}>
                <UserToAttributessGrid data={userToAttributesData} />
            </Card>
            <Drawer
                title={'UserToAttributes'}
                open={showForm}
                onClose={closeButtonHandler}
                width='50%'
            >
                <UserToAttributesForm submitHandler={submitHandler} />
            </Drawer>
        </>
    )
}

export default UserToAttributes