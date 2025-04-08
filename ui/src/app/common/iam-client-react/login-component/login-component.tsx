import { Button, Card, Carousel, Col, Divider, Flex, Form, Input, Row, Typography, notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { forgotPassword, loginUser } from '../actions';
import { useIAMClientState } from '../iam-client';
import productOne from "./images/sustainability.png";
import hrms from "./images/hrms.jpg";
import sakkuLogo from "./images/sakku-logoheader.png";
import acc9 from './images/v1.jpg';
import hrms3 from './images/v2.jpg';
import SchemaxLogo from './images/schemax-logo.png'
// import productTwo from "./images/product-img2.jpg";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Axios from "axios";
import { LoginUserDto } from '../user-models';
import HelpDesk1 from "./images/3.png";
import SchemaxLogoWhite1 from "./images/X Logo 2.png";
import Downlodeicon2 from "./images/download-new-bold.png";
import newvideoicon from "./images/video-icon.png";
import WhatsappIcon from "./images/whatsapp.png";
import './login-component.css';
import { Header } from 'antd/lib/layout/layout';
const { Text, Title } = Typography;


export const LoginComponent = () => {
    const { IAMClientAuthContext, dispatch } = useIAMClientState();
    const navigate = useNavigate();
    const location: any = useLocation();

    const handleLogin = async (values: any) => {
        try {
            const req = new LoginUserDto(values.username, values.password, IAMClientAuthContext.authServerUrl)
            let response = await loginUser(dispatch, req);
            if (!response.user) return false;
            else {
                //reduxDispatch(doLogin(response));
            }
            const from = location.state?.from;
            if (from) {
                navigate(from, { replace: true });
            } else {
                navigate("/", { replace: true });
            }
            localStorage.setItem("helpxUserName", `${values.username}`)
            return true;
        } catch (error: any) {
            notification.config({ maxCount: 3, duration: 3, placement: 'top' });
            notification.destroy();
            notification.error(
                {
                    message: 'Error',
                    description: error.message,
                }
            );
            return false;
        }
    };

    // const ProductsCards = [
    //     {
    //         title: 'Warehouse Mangemennt',
    //         image: productOne,
    //         description: 'To efficiently manage and organize raw materials inventory to ensure timely availability for production while minimizing storage costs and waste.'
    //     }
    // ]
    const ProductsCards = [
        {
            title: 'Warehouse Management',
            image: acc9,
            description:
                'To efficiently manage and organize raw materials inventory to ensure timely availability for production while minimizing storage costs and waste.',
        },
        {
            title: 'Inspection',
            image: hrms3,
            description:
                ' To thoroughly inspect incoming raw materials for quality and compliance with specifications to prevent defects and ensure consistency in product quality. A: 4-point inspection: Assessing four critical aspects (fabric appearance, hand-feel, weight, and width. B: Shade inspection: Checking for color consistency and accuracy. C: Shrinkage inspection: Measuring fabric shrinkage after washing or treatment. D: GSM Inspection: It involves measuring the weight of fabric per unit area, typically in grams per square meter',
        },
        // {
        //     title: 'Inspection',
        //     image: hrms7,
        //     description: ' To thoroughly inspect incoming raw materials for quality and compliance with specifications to prevent defects and ensure consistency in product quality. A: 4-point inspection: Assessing four critical aspects (fabric appearance, hand-feel, weight, and width. B: Shade inspection: Checking for color consistency and accuracy. C: Shrinkage inspection: Measuring fabric shrinkage after washing or treatment. D: GSM Inspection: It involves measuring the weight of fabric per unit area, typically in grams per square meter'

        // },
        // {
        //     title: 'Inspection',
        //     image: hrms10,
        //     description: ' To thoroughly inspect incoming raw materials for quality and compliance with specifications to prevent defects and ensure consistency in product quality. A: 4-point inspection: Assessing four critical aspects (fabric appearance, hand-feel, weight, and width. B: Shade inspection: Checking for color consistency and accuracy. C: Shrinkage inspection: Measuring fabric shrinkage after washing or treatment. D: GSM Inspection: It involves measuring the weight of fabric per unit area, typically in grams per square meter'

        // },
        // {
        //     title: 'Inspection',
        //     image: hrms11,
        //     description: ' To thoroughly inspect incoming raw materials for quality and compliance with specifications to prevent defects and ensure consistency in product quality. A: 4-point inspection: Assessing four critical aspects (fabric appearance, hand-feel, weight, and width. B: Shade inspection: Checking for color consistency and accuracy. C: Shrinkage inspection: Measuring fabric shrinkage after washing or treatment. D: GSM Inspection: It involves measuring the weight of fabric per unit area, typically in grams per square meter'

        // },
    ];

    const contentStyle: React.CSSProperties = {
        height: '86vh',
        color: '#fff',
        textAlign: 'center',
    };
    const downloadFile = async () => {
        const response = await Axios({ url: './assets/product-catalogue-ppt.pdf', method: 'GET', responseType: 'blob' })
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'product-catalogue-ppt.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

    }
    const handleForgotPassword = async () => {
        await forgotPassword(dispatch);
    }


    return (
        <div style={{ height: '100vh', overflowY: 'hidden' }}>
            <Header style={{ padding: '10px', background: 'black', border: '1px solid gray' }}>
                <Row >
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ color: 'white', marginTop: '-3px' }}>
                        <img
                            src={SchemaxLogo}
                            alt="/"
                            style={{ height: '57px', borderRadius: '10px' }}
                        />
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'center', marginTop: '-10px' }}>
                        <img src={SchemaxLogoWhite1} alt="/" style={{ height: "57px" }} />
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8} style={{ display: 'flex', justifyContent: 'end' }}>
                        <a href="tel:+919014375798" ><img src={HelpDesk1} style={{ fontSize: '54px', height: "30px", marginLeft: '20px', cursor: 'pointer' }} /></a>
                        <img src={newvideoicon} alt="/" style={{ fontSize: '24px', height: "30px", marginLeft: '20px', cursor: 'pointer', marginTop: '7px' }} />
                        <img
                            onClick={downloadFile}
                            src={Downlodeicon2}
                            alt="/" style={{ fontSize: '24px', height: "34px", marginLeft: '20px', cursor: 'pointer', marginTop: '7px' }}
                        />

                        <a aria-label="Chat on WhatsApp" target="_blank" href="https://wa.me/919014375798?text=Hi%20there%21%20I%27m%20reaching%20out%20for%20some%20help.%20Can%20you%20assist%20me%20%3F"><img alt="Chat on WhatsApp" src={WhatsappIcon} style={{ color: "white", fontSize: '24px', height: "48px", marginLeft: '20px', cursor: 'pointer' }} />
                        </a>
                    </Col>
                </Row>
            </Header>
            <Row>
                <Col xs={{ span: 24, order: 2 }} sm={{ span: 24, order: 2 }} md={{ span: 16, order: 1 }} lg={{ span: 18, order: 1 }}>
                    <Card style={{ background: 'white', height: '100%', }}
                        bodyStyle={{ padding: "0px" }}
                    >
                        <Carousel
                            arrows={true}
                            className="login-c"
                            autoplay
                            slidesToShow={1} speed={500}>
                            {ProductsCards.map((card, key) => {
                                return <div >
                                    <p style={contentStyle}>
                                        <div key={key}
                                        >
                                            <div className="flip-container">
                                                <div className="flipper">
                                                    <div className="front">
                                                        <div>
                                                            <img style={{
                                                                height: '92vh',
                                                                width: '100%',
                                                                // position: 'relative',
                                                                top: '0', marginTop: "-30px"
                                                            }} className="mb-2" src={card.image} />
                                                        </div>
                                                    </div>
                                                    <div className="back">
                                                        <Col className="justify-center">
                                                            <h3 className="">
                                                                {card.title}
                                                            </h3>
                                                            <p className="description" style={{ color: "black" }}>
                                                                {card.description}
                                                            </p>
                                                        </Col>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </p>
                                </div>
                            })}
                        </Carousel>

                    </Card>
                </Col>
                <Col xs={{ span: 24, order: 1 }} sm={{ span: 24, order: 1 }} md={{ span: 8, order: 2 }} lg={{ span: 6, order: 2 }}
                    style={{ display: 'flex', justifyContent: 'center' }}>
                    <Card style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', fontFamily: 'cursive',
                        background: 'black',
                        boxShadow: 'none',
                        borderRadius: 0,
                        border: 'none'
                    }}>

                        <Card className="glass" style={{
                            textAlign: 'center', background: 'black', fontFamily: 'sans-serif',
                            border: 'none', width: "300px", height: "600px",
                        }}>
                            <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <img src={sakkuLogo} alt="/" style={{
                                    height: "4rem",
                                    marginBottom: '10px'
                                }} />
                            </Row>
                            {/* <Row style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <img src={hrms} alt="/" style={{
                                    height: "4rem",
                                    marginBottom: '10px'
                                }} />
                            </Row> */}
                            <div className="logo">


                                <Form
                                    name="login-form"
                                    initialValues={{ remember: true }}
                                    onFinish={handleLogin}
                                    autoComplete="off">
                                    <Col span={24}>
                                        <Form.Item
                                            name='username'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input your Username!',
                                                },
                                                {
                                                    type: 'email',
                                                    message: 'The input is not valid E-mail!',
                                                },
                                            ]}>
                                            <Input placeholder="Username"
                                                className="custom-placeholder"
                                                style={{
                                                    background: '#000', border: 'none', width: "260px", height: "40px", color: 'white', boxShadow: '0 0 10px #822bff'
                                                }}
                                                autoComplete="new-username"

                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item name='password' rules={[{ required: true, message: 'Please input your password!' }]}>
                                            <Input.Password
                                                className="custom-placeholder"
                                                placeholder="Password"
                                                iconRender={visible => (visible ? <EyeOutlined style={{ color: 'white' }} /> : <EyeInvisibleOutlined style={{ color: 'white' }} />)}
                                                style={{
                                                    background: '#000',
                                                    height: "40px",
                                                    border: 'none',
                                                    color: "white",
                                                    width: "260px",
                                                    boxShadow: '0 0 10px #822bff'
                                                }}
                                                styles={{
                                                    input: {
                                                        background: "#000",
                                                        color: "white",
                                                    }
                                                }}

                                                autoComplete="new-password"
                                            />
                                        </Form.Item>
                                    </Col>

                                    <Col span={24}>
                                        <Col span={24}>
                                            <Button
                                                htmlType="submit"
                                                style={{
                                                    textSizeAdjust: '50',
                                                    backgroundColor: '#7a6bcc',
                                                    width: "260px", color: '#FFFFFF',
                                                    height: "40px", fontSize: '18px',
                                                    border: "black",
                                                    fontFamily: "calibri",
                                                    fontWeight: 'bold',
                                                    boxShadow: '#A46BF5 -4px 15px 40px -8px',
                                                    letterSpacing: '1px',
                                                }}>Login</Button>
                                        </Col>
                                    </Col>
                                    <Form.Item>
                                    <Flex justify="space-between" align="center">
                                        <div></div>
                                        <a  onClick={handleForgotPassword}>Forgot password</a>
                                    </Flex>
                                </Form.Item>
                                </Form>
                            </div>
                        </Card>
                        <div style={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '2px',
                            color: 'white',
                            fontSize: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <Divider style={{ color: '#ffff' }}>Powered by @SchemaxTech</Divider>
                            <span style={{ alignSelf: 'flex-start', fontSize: '15px', fontWeight: '600', marginLeft: '0rem' }}></span>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default LoginComponent;