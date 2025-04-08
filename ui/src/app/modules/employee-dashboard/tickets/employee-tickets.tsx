import { ProCard } from '@ant-design/pro-components';
import { useState } from 'react';
import EmployeeTicketsForm from './employee-tickets-form';
import EmployeeTicketsView from './employee-tickets-view';

const EmployeeTickets = () => {
    const [activeTabKey, setActiveTabKey] = useState('1')


    const renderTabContent = () => {
        switch (activeTabKey) {
            case '1':
                return <EmployeeTicketsView onRaiseTicket={() => setActiveTabKey('2')} />
            case '2':
                return <EmployeeTicketsForm onViewTicket={() => setActiveTabKey('1')} />
            default:
                return <EmployeeTicketsView onRaiseTicket={() => setActiveTabKey('2')} />;
        }
    };

    return (
        <><ProCard
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {renderTabContent()}
        </ProCard>
        </>
    )
}

export default EmployeeTickets