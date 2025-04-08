import axios, { AxiosError } from "axios";
import { ActionTypes } from "./action-types";
import { IAMClientAuthActions } from "./reducers";
import { LoginUserDto, ResetPasswordDto, UserPermissionsDto } from "./user-models";

import { useEffect } from "react";
import { umsJson } from "../ums-json";
import { AxiosInstance, UMSUnitsService } from "@hrexpert/shared-services";
import { configVariables } from "../../../../../libs/shared-services/src/lib/config";

export const loginUser = async (dispatch: React.Dispatch<IAMClientAuthActions>, loginPayload: LoginUserDto) => {
    const { authServerUrl, username, password } = loginPayload
    //const service = new UsersService();
    const fileUploadPath = authServerUrl;
    const unitService = new UMSUnitsService()

const IamUrl=configVariables.APP_IAM_SERVER_URL


    try {
        dispatch({ type: ActionTypes.REQUEST_LOGIN });
        const response = await AxiosInstance.post(`${IamUrl}/authentications/login`, {
            username,
            password,
        });
        const res = response.data;
        if (res.status) {
            const aaa: any = res.data;
            localStorage.setItem('accessToken', aaa.accessToken);
            const menuData: UserPermissionsDto = aaa.accessMenuObj;
            const units = []
            if (menuData.roleName.includes('SuperAdmin')) {
                const unit = await unitService.getAllUnitsDropDown()
                if (unit.status) {
                    units.push(unit.data)
                } else {
                    units.push([]);
                }
                menuData.menusData.push(umsJson as any)
            }
            
            const data = {
                loading: false,
                isAuthenticated: true,
                user: {
                    userId: menuData.userId,
                    userName: menuData.userName,
                    profilePicPath: aaa?.['filesData']?.[0]?.filePath?.slice(7) ? fileUploadPath + '/' + aaa?.['filesData']?.[0]?.filePath?.slice(7) : null,
                    roles: menuData.roleName ? menuData.roleName.join(',') : ``,
                    // companyCode: 'Shahi',
                    // unitCode: '12',
                    // orgData: {
                    //     unitCode: '12',
                    //     companyCode: 'Shahi'
                    // }
                    employeeId:menuData.employeeId,
                    employeeCode:menuData.employeeCode,
                    unit:menuData.unit,
                    unitId:menuData.unitId,
                    branchChildren:menuData.branchChildren
                },
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: aaa.accessToken,
                menuAccessObject: menuData.menusData,
                units: units?.length ? units[0] : [],
                errorMessage: ''
            }
            dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
            localStorage.setItem('currentUser', JSON.stringify(data));
            return data
        } else {
            throw new AxiosError(res.internalMessage, res.status);
        }
    } catch (error: any) {
        let errorMessageText = ``
        if (error.response.status === 401) {
            errorMessageText = `Invalid username or password. Please try again later.`;
        } else if (error.response.status === 404) {
            errorMessageText = `The requested resource was not found on the server.`;
        } else {
            errorMessageText = `An error occurred during login. Please try again later.`;
        }
        const errorMessage: any = { errorMessage: errorMessageText };
        dispatch({ type: ActionTypes.LOGIN_ERROR, payload: errorMessage });
        throw Error(errorMessageText);
    }
}

export const logout = async (dispatch: React.Dispatch<IAMClientAuthActions>) => {
    dispatch({ type: ActionTypes.LOGOUT });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
}

export const forgotPassword = async (dispatch: React.Dispatch<IAMClientAuthActions>) => {
    dispatch({ type: ActionTypes.FORGOT_PASSWORD });
    const data = {
        loading: false,
        isAuthenticated: false,
        isForgotPassword: true,
        otpTab: 0,
        user: {},
        defaultPlant: 'SRPL',
        defaultPlantCurrency: 'IDR',
        token: '',
        menuAccessObject: [],
        errorMessage: ''
    }
    localStorage.setItem('currentUser', JSON.stringify(data));
}

export const sendOtp = async (dispatch: React.Dispatch<IAMClientAuthActions>, loginPayload: LoginUserDto) => {
    const { authServerUrl, username } = loginPayload
    const IamUrl=configVariables.APP_IAM_SERVER_URL
    try {
        dispatch({ type: ActionTypes.REQUEST_OTP });
        const response = await axios.post(`${IamUrl}/authentications/forgot-password`, {
            username
        });
        const res = response.data;
        if (res.status) {
            dispatch({ type: ActionTypes.OTP_SUCCESS });
            const data = {
                loading: false,
                isAuthenticated: false,
                isForgotPassword: true,
                otpTab: 1,
                user: {
                    userName: username
                },
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: '',
                menuAccessObject: [],
                errorMessage: ''
            }
            localStorage.setItem('currentUser', JSON.stringify(data));
            return res
        } else {
            if (res.internalMessage.includes('OTP was already sent')) {
                dispatch({ type: ActionTypes.OTP_SUCCESS });
                const data = {
                    loading: false,
                    isAuthenticated: false,
                    isForgotPassword: true,
                    otpTab: 1,
                    user: {
                        userName: username
                    },
                    defaultPlant: 'SRPL',
                    defaultPlantCurrency: 'IDR',
                    token: '',
                    menuAccessObject: [],
                    errorMessage: ''
                }
                localStorage.setItem('currentUser', JSON.stringify(data));

            }
            throw new Error(res.internalMessage);
        }
    } catch (error: any) {
        if (error.message.includes('OTP was already sent')) {
            dispatch({ type: ActionTypes.OTP_SUCCESS });
            const data = {
                loading: false,
                isAuthenticated: false,
                isForgotPassword: true,
                otpTab: 1,
                user: {
                    userName: username
                },
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: '',
                menuAccessObject: [],
                errorMessage: ''
            }
            localStorage.setItem('currentUser', JSON.stringify(data));
        }
        const errorMessage: any = { errorMessage: error.message };
        dispatch({ type: ActionTypes.OTP_ERROR, payload: errorMessage });
        throw Error(error.message);
    }
}

export const resetPassword = async (dispatch: React.Dispatch<IAMClientAuthActions>, loginPayload: ResetPasswordDto) => {
    const { authServerUrl, username, otp, newPassword } = loginPayload
    const IamUrl=configVariables.APP_IAM_SERVER_URL
    try {
        dispatch({ type: ActionTypes.REQUEST_RESET_PWD });
        const response = await axios.post(`${IamUrl}/authentications/reset-password`, {
            username,
            otp,
            newPassword
        });
        const res = response.data;
        if (res.status) {
            dispatch({ type: ActionTypes.RESET_PWD_SUCCESS });
            const data = {
                loading: false,
                isAuthenticated: false,
                isForgotPassword: true,
                otpTab: 2,
                user: {},
                defaultPlant: 'SRPL',
                defaultPlantCurrency: 'IDR',
                token: '',
                menuAccessObject: [],
                errorMessage: ''
            }
            localStorage.setItem('currentUser', JSON.stringify(data));
        } else {
            throw new Error(res.internalMessage);
        }
    } catch (error: any) {
        const errorMessage: any = { errorMessage: error.message };
        dispatch({ type: ActionTypes.RESET_PWD_ERROR, payload: errorMessage });
        throw Error(errorMessage);
    }
}