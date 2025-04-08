import { InitialStateType } from './iam-client';
import { ActionTypes } from './action-types';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
  ? {
    type: Key;
  }
  : {
    type: Key;
    payload: M[Key];
  }
};


export interface AuthPayLoadObject {
  isAuthenticated: boolean,
   user: any,
  defaultPlant: string,
  defaultPlantCurrency: string,
  token: any,
  menuAccessObject: any
  loading: boolean;
  errorMessage: string | null;
}

export interface AuthPayload {
  [ActionTypes.REQUEST_LOGIN]: undefined;
  [ActionTypes.LOGIN_SUCCESS]: AuthPayLoadObject;
  [ActionTypes.LOGIN_ERROR]: AuthPayLoadObject;
  [ActionTypes.LOGOUT]: undefined;
  [ActionTypes.ASSIGN_UNIT]: string;
  [ActionTypes.FORGOT_PASSWORD]: undefined;
  [ActionTypes.REQUEST_OTP]: undefined;
  [ActionTypes.OTP_SUCCESS]: undefined;
  [ActionTypes.OTP_ERROR]: AuthPayLoadObject;
  [ActionTypes.REQUEST_RESET_PWD]: undefined;
  [ActionTypes.RESET_PWD_SUCCESS]: undefined;
  [ActionTypes.RESET_PWD_ERROR]: AuthPayLoadObject;

}

export type IAMClientAuthActions = ActionMap<AuthPayload>[keyof ActionMap<AuthPayload>];

export const authReducer = (state: InitialStateType, action: IAMClientAuthActions) => {
  switch (action.type) {
    case ActionTypes.REQUEST_LOGIN:
      return {
        ...state,
        isForgotPassword: false,
        loading: true
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isForgotPassword: false,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        token: action.payload.token,
        defaultPlant: action.payload.defaultPlant,
        defaultPlantCurrency: action.payload.defaultPlantCurrency,
        menuAccessObject: action.payload.menuAccessObject,
      }
    case ActionTypes.ASSIGN_UNIT:
      return {
        ...state, user: {
          ...state.user, unitCode: action.payload, orgData: { ...state.user.orgData, unitCode: action.payload }
        }
      }
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isForgotPassword: false,
        user: null,
        defaultPlant: '',
        defaultPlantCurrency: '',
        token: null,
        menuAccessObject: []
      };
    case ActionTypes.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        isForgotPassword: false,
        errorMessage: action.payload.errorMessage
      };
      case ActionTypes.FORGOT_PASSWORD:
        return {
          ...state,
          isForgotPassword: true,
          otpTab: 0,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: []
        };
      case ActionTypes.REQUEST_OTP:
        return {
          ...state,
          isForgotPassword: true,
          otpTab: 0,
          loading: true,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: []
        };
      case ActionTypes.OTP_SUCCESS:
        return {
          ...state,
          isForgotPassword: true,
          otpTab: 1,
          loading: false,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: []
        };
      case ActionTypes.OTP_ERROR:
        return {
          ...state,
          isForgotPassword: true,
          loading: false,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: [],
          errorMessage: action.payload.errorMessage
        };
      case ActionTypes.REQUEST_RESET_PWD:
        return {
          ...state,
          isForgotPassword: true,
          otpTab: 1,
          loading: true,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: []
        };
      case ActionTypes.RESET_PWD_SUCCESS:
        return {
          ...state,
          isForgotPassword: true,
          otpTab: 2,
          loading: false,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: []
        };
      case ActionTypes.RESET_PWD_ERROR:
        return {
          ...state,
          isForgotPassword: true,
          loading: false,
          isAuthenticated: false,
          user: null,
          defaultPlant: '',
          defaultPlantCurrency: '',
          token: null,
          menuAccessObject: [],
          errorMessage: action.payload.errorMessage
        };
    default:
      return state;
  }

}
