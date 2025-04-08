
import * as ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import App from './app/app';
import { NotificationProvider } from './app/common/notifications';
import { IAMClientProvider } from './app/common/iam-client-react';
import { configVariables } from '../../libs/shared-services/src/lib/config';


const authServerUrl = configVariables.APP_MASTERS_SERVICE_URL;
const clientId = configVariables.APP_IAM_CLIENT_ID;

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

root.render(
  <Router>  
    <NotificationProvider>
      <IAMClientProvider authServerUrl={authServerUrl} clientId={clientId}>
        <App />
      </IAMClientProvider>
    </NotificationProvider>
  </Router>
);
