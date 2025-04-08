import React, { PropsWithChildren, createContext, useMemo, useReducer } from 'react';
import { authReducer } from './reducers';
import { umsJson } from '../ums-json';

export type InitialStateType = {
    clientId: string;
    authServerUrl: string;
    isAuthenticated: boolean,
    user: User,
    defaultPlant: string,
    defaultPlantCurrency: string,
    token: any,
    menuAccessObject: any,
    defaultPlantName: string,
    employeeCode: string,
    employeeId: string,
    units: { name: string, unitId: string | number }[]
    isForgotPassword: boolean;
    otpTab: number;
}

export class User {
    userId: number;
    userName: string;
    profilePicPath: null;
    roles: string;
    companyCode: string;
    unitCode: string;
    unitId: string;
    unit: string;
    employeeCode: string;
    employeeId: string;
    orgData: {
        unitCode: string;
        companyCode: string;
    };
    branchChildren?: any[]
    
}
export const initialAuthState: InitialStateType = {
    clientId: '',
    authServerUrl: '',
    isAuthenticated: false,
    user: {
        userId: 4,
        userName: 'admin',
        profilePicPath: null,
        roles: 'Admin',
        companyCode: 'Shahi',
        unitCode: '12',
        unitId: '1',
        unit: 'string',
        employeeCode: 'string',
        employeeId: '1',
        orgData: { unitCode: '12', companyCode: 'Shahi' },
        branchChildren:[{
            "unitIds": "1",
            "userId": "1019",
            "unitName": "HEPL - ABANPUR"
        }]
    },
    defaultPlant: 'SRPL',
    defaultPlantCurrency: 'USD',
    defaultPlantName: "SAII Resources Pvt Ltd",
    employeeCode: "",
    employeeId: "",
    units: [],
    token: null,
    menuAccessObject: [umsJson],
    isForgotPassword: false,
    otpTab: 0,
}


interface IAMClientAuthContextType {
    IAMClientAuthContext: InitialStateType;
    dispatch: React.Dispatch<any>;
}

interface AuthContextProps {
    children: React.ReactNode;
}

const IAMClientContext = createContext<IAMClientAuthContextType>({
    IAMClientAuthContext: initialAuthState,
    dispatch: () => null
});

interface AuthContextProps {
    children: React.ReactNode;
    authServerUrl: string;
    clientId: string;
}

const IAMClientProvider: React.FC<PropsWithChildren<AuthContextProps>> = ({
    clientId,
    authServerUrl,
    children,
}: {
    children: React.ReactNode;
    authServerUrl: string;
    clientId: string;
}) => {
    const existing = JSON.parse(localStorage.getItem('currentUser')) || {}
    const [IAMClientAuthContext, dispatch] = useReducer(authReducer, { ...initialAuthState, ...existing, clientId, authServerUrl });

    const value = useMemo(() => ({ IAMClientAuthContext, dispatch }), [IAMClientAuthContext]);

    return <IAMClientContext.Provider value={value}>{children}</IAMClientContext.Provider>;
};

const useIAMClientState = () => {
    const context = React.useContext(IAMClientContext);
    if (context === undefined) {
        throw new Error("useIAMClientState must be used within a IAMClientProvider");
    }
    return context;
}

export { IAMClientProvider, IAMClientContext, useIAMClientState };
