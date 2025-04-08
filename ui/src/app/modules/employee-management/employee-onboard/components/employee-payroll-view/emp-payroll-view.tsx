import { FormInstance, Modal, Select } from 'antd'
import { useState } from 'react'
const { Option } = Select
export interface EmpPayRollViewProps {
    form: FormInstance<any>
}
const EmpPayrollView = (props: EmpPayRollViewProps) => {
    const { form } = props
    const [openModal, setOpenModal] = useState(false);

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    return (
        <>
        </>
    )
}

export default EmpPayrollView