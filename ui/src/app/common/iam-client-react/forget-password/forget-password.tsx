import { Button, Card, Form, Input, notification, Steps } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIAMClientState } from '../iam-client';
import { loginUser, logout, resetPassword, sendOtp } from '../actions';
import { useNavigate } from 'react-router-dom';
import { LoginUserDto, ResetPasswordDto } from '../user-models';

export const ForgotPassword: React.FC = () => {
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [username, setUsername] = useState<string>('');

    const [form] = Form.useForm();
    useEffect(() => {
        setCurrentStep(IAMClientAuthContext.otpTab);
    }, [IAMClientAuthContext.otpTab]);


    const handleForgotPassword = async (values: { username: string }) => {
        // API call for forgot password
        try {
            const req = new LoginUserDto(values.username, undefined, IAMClientAuthContext.authServerUrl)
            setUsername(values.username);
            const res = await sendOtp(dispatch, req);
            console.log(res,'********')
            if (res.status) {
                notification.success({ message: 'OTP sent successfully!' });
            } else {
                notification.error({ message: 'Failed to send OTP', description: res.internalMessage });
            }
        } catch (error) {
            notification.error({ message: 'Failed to send OTP', description: error.message });
        }
    };

    const handleResetPassword = async (values: { otp: string; newPassword: string }) => {
        // API call for reset password
        try {
            const req = new ResetPasswordDto(username, values.otp, values.newPassword, IAMClientAuthContext.authServerUrl)
            await resetPassword(dispatch, req);
            notification.success({ message: 'Password reset successfully!' });
        } catch (error) {
            notification.error({ message: 'Failed to reset password', description: error.message });
        }
    };

    const handleLogout = async () => {
        try {
            await logout(dispatch);
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error)
        }
    };

    const steps = [
        {
            title: 'Forgot Password',
            content: (
                <Form layout="vertical" form={form} onFinish={handleForgotPassword}>
                    <Form.Item
                        label="Username or Email"
                        name="username"
                        rules={[
                            { required: true, message: 'Please input your username or email!' },
                            { type: 'email', message: 'Please enter a valid email address!' },
                        ]}
                    >
                        <Input placeholder="Enter your email or username" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Send OTP
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Reset Password',
            content: (
                <Form layout="vertical" form={form} onFinish={handleResetPassword}>
                    <Form.Item
                        label="OTP"
                        name="otp"
                        rules={[{ required: true, message: 'Please input the OTP sent to your email!' }]}
                    >
                        <Input placeholder="Enter OTP" />
                    </Form.Item>
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: 'Please input your new password!' },
                            { min: 6, message: 'Password must be at least 6 characters!' },
                        ]}
                    >
                        <Input.Password placeholder="Enter your new password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Done',
            content: (
                <div style={{ textAlign: 'center' }}>
                    <h3>Your password has been reset successfully!</h3>
                    <Button type="primary" onClick={handleLogout}>
                        Go to Login
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <Card style={{ margin: '50px', borderRadius: 10 }} extra={<Button onClick={handleLogout} type="primary">Go to Login</Button>}>
            <Steps current={currentStep} style={{ marginBottom: 30 }}>
                {steps.map((item, index) => (
                    <Steps.Step key={index} title={item.title} />
                ))}
            </Steps>
            <div>{steps[currentStep].content}</div>
        </Card>
    );
};

export default ForgotPassword;
