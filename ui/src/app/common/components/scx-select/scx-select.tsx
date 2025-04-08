import { PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Select } from 'antd';
import { SelectProps } from 'antd/lib';
import React, { useState } from 'react'
const { Option } = Select
interface OptionType {
    value: string | number;
    label: string;
}

// Define the props for the CustomSelect component
interface CustomSelectProps extends SelectProps<string | number> {
    options: OptionType[];
    label: string;
    children: React.ReactElement;
    closeModal : () => void
}

export default function SCXSelect(props: CustomSelectProps) {
    const { options, label ,children} = props;
    const [visible, setVisible] = useState(false); // State to manage modal visibility
    const enhancedChildren = React.cloneElement(children, { closeModal: handleModalClose });

    const handleAddClick = () => {
        setVisible(true); // Show the modal

    };

    // Function to close the modal
    function handleModalClose()  {
        setVisible(false);
    };
    const dropdownRender = (menu: React.ReactNode) => (
        <div>
            {menu}
            <div style={{ display: 'flex', justifyContent: 'center', padding: 8 }}>
                <Button
                    onClick={handleAddClick}
                    style={{ width: '100%' }}
                    icon={<PlusOutlined />}
                    iconPosition='start'
                >
                    Add {label}
                </Button>
            </div>
        </div>
    );

    
    return (
        <>
            <Select
                {...props}  // Pass down all other props to maintain Antd Select's features
                dropdownRender={dropdownRender} // Custom dropdown with "Add {label}" button
            >
                {options.map((option) => (
                    <Option key={option.value} value={option.value}>
                        {option.label}
                    </Option>
                ))}
            </Select>
            <Modal
                title={`Add ${label}`}
                open={visible}
                width={'60%'}
                onCancel={handleModalClose}
                footer={null} // You can customize the footer if needed
            >
                {children} {/* Render the children passed to the CustomSelect */}
            </Modal>
        </>
        
    )
}
