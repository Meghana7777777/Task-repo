import { CaretRightOutlined, GlobalOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { AlertMessages } from '@hrexpert/shared-models';
import { EmployeeTicketsService } from '@hrexpert/shared-services';
import { Badge, Button, Modal, Tag } from 'antd';
import { useEffect, useState } from 'react';

const EmployeeTicketsView = ({ onRaiseTicket }) => {
  const employeeTicketsService = new EmployeeTicketsService()
  const [ticketsData, setTicketsData] = useState<any[]>([])
  const data = JSON.parse(localStorage.getItem('currentUser'))
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [ticketDetails, setTicketDetails] = useState<any>()

  useEffect(() => {
    getTickets()
  }, [])


  const getTickets = () => {
    try {
      const req = { employeeId: data.user.employeeId }
      employeeTicketsService.getTickets(req).then((res) => {
        if (res.status) {
          setTicketsData(res.data)
        } else {
          AlertMessages.getSuccessMessage(res.internalMessage)
          console.log("Failed to post Data");
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  const formatCreatedAt = (createdAt: string): string => {
    const date = new Date(createdAt);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
    const day = date.getDate();
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${formattedHours}:${minutes} ${period}, ${day}th ${month} ${year}`;
  };
  return (
    <>


      <ProCard
        title={`All Tickets (${ticketsData.length})`}
        extra={<Button key='1' type='default' onClick={onRaiseTicket}>Raise a new ticket</Button>}
      >
        {(ticketsData.length ?
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {ticketsData &&
                ticketsData.map((ticket, parentIndex: number) => (
                  <>
                    <ProCard style={{ width: '50rem' }} bordered headerBordered title={<span>Ticket ID : {'TID' + ticket.id}</span>}
                      extra={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ marginRight: '14rem', flexGrow: 1, textAlign: 'center' }}>{'Created On : ' + formatCreatedAt(ticket.createdAt)}</span>
                          <Tag color={ticket.status == 'Open' ? 'blue' : 'green'} style={{ borderRadius: 50 }}>{ticket.status}</Tag>
                        </div>
                      }>
                      <h3> <CaretRightOutlined /> Subject: {ticket.subject}</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px' }}>Category : {ticket.category}</span>
                        <a
                          onClick={() => { setOpenModal(true), setTicketDetails(ticketsData.find((rec) => rec.id === ticket.id)) }}
                          style={{ color: '#1677FF', textDecoration: 'none', fontWeight: 'bold', }}
                        >
                          View Details
                        </a>
                      </div>
                    </ProCard>
                  </>
                ))}
            </div>
          </> :
          <ProCard style={{ width: '40rem' }}>
            No tickets raised
          </ProCard>
        )}


      </ProCard>


      <Modal
        width={'55rem'}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <ProCard style={{ width: '50rem' }} bordered headerBordered title={<span>Ticket ID : {'TID' + ticketDetails?.id}</span>}
            extra={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ marginRight: '14rem', flexGrow: 1, textAlign: 'center' }}>{'Created On : ' + formatCreatedAt(ticketDetails?.createdAt)}</span>
                <Tag color={ticketDetails?.status == 'Open' ? 'blue' : 'green'} style={{ borderRadius: 50 }}>{ticketDetails?.status}</Tag>
              </div>
            }>
            <h3> <CaretRightOutlined /> Subject: {ticketDetails?.subject}</h3>
            <span style={{ fontSize: '14px' }}>Category : {ticketDetails?.category}</span>
          </ProCard>

          <ProCard style={{ width: '50rem' }} bordered title={<>You <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '5px', color: '#888' }}> ({formatCreatedAt(ticketDetails?.createdAt || new Date())})</span></>}>
            <span style={{ fontSize: '14px' }}>{ticketDetails?.issue}</span>
          </ProCard>

          {(ticketDetails?.status === 'Closed' ?
            <>
              <ProCard style={{ width: '50rem' }} bordered title={<>Support Team <span style={{ fontSize: '14px', fontWeight: 'normal', marginLeft: '5px', color: '#888' }}> ({formatCreatedAt(ticketDetails?.updatedAt || new Date())})</span></>}>
                <span style={{ fontSize: '14px' }}>{ticketDetails?.reply}</span>
              </ProCard>
              <ProCard>
                You cannot post new comments as the ticket is CLOSED. If your query is unresolved, you can start a
                <a onClick={onRaiseTicket} style={{ color: '#1677FF', textDecoration: 'underline', fontWeight: 'bold' }}> fresh ticket</a>
              </ProCard></> :
            <ProCard>
              Your ticket is still in OPEN. Waiting for the response from support team
            </ProCard>
          )}

        </div>
      </Modal>
    </>
  )
}

export default EmployeeTicketsView