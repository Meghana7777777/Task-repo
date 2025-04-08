import React, { useState, useEffect } from 'react';
import { Form, Checkbox, InputNumber, Row, Col, Button, Input, Select, message } from 'antd';
import { EmployeeOnboardingService, EmployeeTypeService } from '@hrexpert/shared-services';
import { PrefixConfigurationDto } from '@hrexpert/shared-models';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
const { Option } = Select
const prefixOptions = [
    { label: 'Branch', value: 'branch', key: 'branch' },
    { label: 'Department', value: 'department', key: 'department' },
    { label: 'Designation', value: 'designation', key: 'designation' },
    //{ label: 'Year', value: 'year', key: 'year' },
    { label: 'Custom field', value: 'customField', key: 'customField' }
];

// Example values for each field to generate sample codes
const sampleValues: Record<string, string> = {
    division: 'Div1',
    branch: 'Unit1',
    department: 'Dep1',
    designation: 'Des1',
    customField: 'CUS',
    year: moment().year().toString(),

};

type FieldPositions = {
    [key: string]: number;
};

export default function PrefixConfigurationForm() {
    const [selectedFields, setSelectedFields] = useState<any[]>([]);
    const [fieldPositions, setFieldPositions] = useState<FieldPositions>({});
    const [previewPrefix, setPreviewPrefix] = useState<string>('');
    const [employeeTypes, setEmployeeTypes] = useState([])
    const employeeTypesService = new EmployeeTypeService()
    const employeeOnboardingService = new EmployeeOnboardingService()
    const [prefConfForm] = Form.useForm()
    const navigate = useNavigate()
    useEffect(() => {
        getEmployeeTypes()
    }, []
    )


    const getEmployeeTypes = () => {
        employeeTypesService.getActiveEmployeeType().then((res) => {
            if (res.status) {
                setEmployeeTypes(res.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }




    // Handle selected fields
    const onFieldChange = (checkedValues: any[]) => {
        setSelectedFields(checkedValues);
        setFieldPositions((prev) => {
            // Reset positions for unselected fields
            const updatedPositions = { ...prev };
            Object.keys(updatedPositions).forEach((key) => {
                if (!checkedValues.includes(key)) delete updatedPositions[key];
            });
            return updatedPositions;
        });
    };

    console.log(selectedFields, fieldPositions)
    // Handle position change for each field
    const onPositionChange = (field: string, position: number) => {
        setFieldPositions((prev) => ({ ...prev, [field]: position }));
    };

    // Generate the preview prefix based on selected fields and positions
    useEffect(() => {
        // Sort fields based on their assigned positions
        const sortedFields = Object.keys(fieldPositions)
            .sort((a, b) => fieldPositions[a] - fieldPositions[b])
            .map((field) => {
                if (field == "customField") {
                    return prefConfForm.getFieldValue('customField')
                } else {
                    return sampleValues[field]
                }
            });

        setPreviewPrefix(sortedFields.join('').toUpperCase() + "0001");
    }, [fieldPositions]);

    function onSave(values: any) {
        // Transform selected fields and positions into FieldPositionDto format
        // Construct the PrefixConfigurationDto
        const prefixConfigurationDto: PrefixConfigurationDto = {
            employeeTypeId: values.employeeTypeId,
            selectedFields: selectedFields, // Array of selected fields
            fieldPositions: fieldPositions,
            customFieldText: values.customField
            // Transformed field positions
        };

        // Save the DTO via the service
        employeeOnboardingService
            .saveEmployeePrefixConfigurations(prefixConfigurationDto)
            .then((res) => {
                if (res.status) {
                    message.success("Prefix configuration saved successfully");
                }
            })
            .catch((err) => {
                message.error("Failed to save prefix configuration");
                console.error(err);
            });
    }


    return (
        <Form form={prefConfForm} onFinish={onSave} layout="vertical">
            <Row gutter={24}>
                <Col span={24}>
                    <Form.Item label="Employee Type" name='employeeTypeId' rules={[{ required: true, message: "Please select an employee type!" }]} // Validation rule for required field
                    >
                        <Select variant='filled' placeholder={'Select Employee Type'}  >
                            {
                                employeeTypes.map((v: any) => { return <Option key={v.id} value={v.id}>{v.name}</Option> })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item rules={[
                        { required: true, message: "Please select at least one field!" }, // Ensure at least one checkbox is selected
                    ]} label="Select fields" name="selectedFields" >
                        <Checkbox.Group options={prefixOptions} onChange={onFieldChange} />
                    </Form.Item>
                </Col>
            </Row>

            {selectedFields.length > 0 && (
                <Row gutter={24}>
                    <>
                        {
                            selectedFields.includes("customField") ?
                                <>
                                    <Col span={16}>
                                        <Form.Item
                                            label="Enter Custom field text"
                                            key={'customField'}
                                            name={`customField`}
                                            rules={[
                                              //  { required: true, message: "Custom field text is required!" }, // Custom field required validation
                                                { max: 50, message: "Text cannot exceed 50 characters!" }, // Maximum length validation
                                            ]}
                                        >
                                            <Input placeholder='Enter Custom field text' variant='filled' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={8}>
                                        <Form.Item
                                            label="Custom field position"
                                            key={'customFieldPosition'}
                                            name={`position_customField`}
                                            rules={[
                                              //  { required: true, message: "Custom field position is required!" }, // Required validation
                                                { type: "number", min: 1, message: "Position must be at least 1!" }, // Minimum value validation
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%' }} onChange={(value) => onPositionChange("customField", value as number)}
                                                min={1} placeholder='Custom field position' variant='filled' />
                                        </Form.Item>
                                    </Col>
                                </>
                                : <></>
                        }
                        {selectedFields.map((field) => {
                            if (field === "customField") return <> </>;
                            return <Col span={4} key={field.toString()}>

                                <Form.Item
                                    key={field}
                                    label={`Position for ${field.toString().charAt(0).toUpperCase() + field.toString().slice(1)}`}
                                    name={`position_${field}`}
                                    rules={[
                                        { required: true, message: `Position for ${field} is required!` }, // Required validation
                                        {
                                            type: "number",
                                            min: 1,
                                            max: selectedFields.length,
                                            message: `Position must be between 1 and ${selectedFields.length}!`,
                                        }, // Range validation
                                    ]}
                                >
                                    <InputNumber
                                        style={{ width: '100%' }}
                                        variant='filled'
                                        min={1}
                                        max={selectedFields.length}
                                        placeholder={`Position for ${field.toString().charAt(0).toUpperCase() + field.toString().slice(1)}`}
                                        onChange={(value) => onPositionChange(field.toString(), value as number)}
                                    />
                                </Form.Item>
                            </Col>
                        }
                        )}
                    </>
                </Row>
            )}

            {/* Display Preview Prefix */}
            <Form.Item label="Sample Employee Code Prefix" >

                <Input placeholder="Sample Employee Code Prefix" variant='borderless' value={previewPrefix} readOnly />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Save Configuration
                </Button>
            </Form.Item>
        </Form>
    );
}
