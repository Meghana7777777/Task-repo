import { Card, Typography } from 'antd';
import { AddEmployeeIcon } from '../../../../common/icons/add-employee-icon';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export default function AddEmployeeCard() {
  const navigate = useNavigate();
  function navigateToForm() {
    navigate('/employee-management/employee-form')
  }
  return (
    <Card
      hoverable
      styles={{ body: { padding: '20px 24px' } }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 8,
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
      onClick={navigateToForm} // Replace this with your actual navigation logic
    >
      <AddEmployeeIcon style={{ fontSize: 85 }} />
      <div>
        <Text strong style={{ fontSize: 22, color: "#1890ff" }}>Add Employee</Text>
      </div>
    </Card>
  );
}
