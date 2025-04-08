
import { ConfigProvider, ThemeConfig, theme } from 'antd';
import en_US from 'antd/es/locale/en_US';

import { RouterProvider } from 'react-router-dom';
import { router, ssprouter } from './routes';
import { useEffect, useState } from 'react';

import { AxiosInstance } from '../../../libs/shared-services/src/lib/axios-instance'
import LoadingSpinner from './common/loading-spinner/loading-spinner';
import { LoginComponent, useIAMClientState } from './common/iam-client-react';
import CustomProLayout from './basic-layout/custom-pro-layout';
import { blue } from '@ant-design/colors';
import Login from './layouts/login/login';
import { ForgotPassword } from './common/iam-client-react/forget-password';
import JoiningForm from './modules/recruitment/requirement/joining-form';
import RecruitmentEmployeeJoiningForm from './modules/recruitment/joining-form/joining-form';



function App() {
  const currentUrl: string = window.location.href;
  const params = currentUrl.split('/#/')[1];
  const profileId = currentUrl.split('#/')[2];
  const { IAMClientAuthContext, dispatch } = useIAMClientState();
  let counter = 0;
  const [load, setLoad] = useState(false);

  const light: ThemeConfig = {
    algorithm: [theme.compactAlgorithm],
    token: {
      wireframe: false,
      borderRadius: 6,
    },
    components: {
      Table: {
        rowHoverBg: blue[0],
        headerSortHoverBg: blue[1]
      },
      Collapse: {
        headerBg: '#bfbfbf',//'#0096c1',
        colorTextHeading: '#fff'
      },
      Card: {
        headerBg: blue[0]
      },

    }
  }


  AxiosInstance.interceptors.request.use((request: any) => {
    counter++;
    if (!request['loadStatus']) {
      setLoad(true);
    }
    return request;
  });

  AxiosInstance.interceptors.response.use(response => {
    counter--;
    if (counter == 0) {
      setLoad(false);
    }
    return response;
  }, error => {
    counter--;
    if (counter == 0)
      setLoad(false);
    throw error;
  })

  useEffect(() => {
    const script = document.createElement('script');
    const windowLocal: any = window

    script.src = "https://proticketx-v1-be.schemaxtech.in/static/helpx-bot/helpx-bot.js?appClientId=70&&applicationName='Sakku hrms'";

    document.body.appendChild(script);
    script.onload = () => {
      console.log('Script loaded successfully');
      if (typeof windowLocal.initializeTicketingTool === 'function') {
        windowLocal.initializeTicketingTool();
      }
    };

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (IAMClientAuthContext.isAuthenticated ? <ConfigProvider theme={light} locale={en_US}>
    <LoadingSpinner loading={load} />
    <div className="App">
      <CustomProLayout key="1" />
    </div>
  </ConfigProvider>
    :
    <div >
      {/* <LoginComponent /> */}
      {IAMClientAuthContext.isForgotPassword ? <ForgotPassword /> : params === 'employee-registration-joining-form' ?
        <ConfigProvider locale={en_US}>
            <RecruitmentEmployeeJoiningForm profileId={profileId}/>
        </ConfigProvider>
        : <LoginComponent />}
    </div>
  );
}

export default App;
