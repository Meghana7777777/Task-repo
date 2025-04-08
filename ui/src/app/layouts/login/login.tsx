import { DefaultFooter, PageContainer } from '@ant-design/pro-layout'
import { Button, Card, Col, Form, Input, message, Row, Space } from 'antd'
import React from 'react'
import SchemaxLogo from '../../../assets/images/schemax-logo-dark.png'
import FormItem from 'antd/es/form/FormItem'
import { useNavigate } from 'react-router-dom'
export default function Login() {

    const navigate = useNavigate()

    function login(values) {

        if (values.username !== "superadmin" || values.password !== "2024@superadmin") return message.error("Username or password incorrect")
            localStorage.setItem('isAuthenticated', "true")
            localStorage.setItem('username', values.username)
            navigate("/", { replace: true })
        }
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Full viewport height
                textAlign: 'center', // Center text inside div
                backgroundColor: '#f5f5f5'
            }}>
                <Row justify={'center'} gutter={[24, 24]}>
                    <Col span={8}>
                        <img src={SchemaxLogo} style={{ height: '50px' }} />
                    </Col>
                </Row>
                <Row justify={'center'} gutter={[24, 24]}>
                    <Col span={24}>
                        <Card >
                            <Form onFinish={login} layout='vertical'>
                                <Row gutter={[24, 12]}>
                                    <Col span={24}>
                                        <Form.Item label='Username' name={'username'}>
                                            <Input placeholder='Enter username' variant='filled' />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label='Password' name='password'>
                                            <Input.Password placeholder='Enter password' variant='filled' />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={24}>
                                        <Button htmlType='submit' type='primary'>Login</Button>
                                    </Col>
                                </Row>

                            </Form>

                        </Card>
                    </Col>
                </Row>
                <Row justify={'center'} gutter={[24, 24]}>
                    <DefaultFooter
                        copyright="2024 powered by Schemax tech"
                        links={[
                            {
                                key: 'SchemaX Tech',
                                title: 'SchemaX Tech',
                                href: 'https://www.schemaxtech.com/',
                                blankTarget: true,
                            },

                        ]}

                    />

                </Row>
            </div>
        )
    }
