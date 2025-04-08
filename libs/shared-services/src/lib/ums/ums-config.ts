// require('dotenv').config();
export interface ConfigTypo {
    APP_WMS_SERVICE_URL: string,

    APP_WHATSAPP_NOTIFICATION_URL: string,
    APP_WHATSAPP_BROADCAST_URL: string,
    APP_KEYCLOAK_REALM: string,
    APP_KC_CLIENT: string,
    APP_KC_SECRET: string,
    APP_KEYCLOAK_JOBS_USER_USER_NAME: string,
    APP_KEYCLOAK_JOBS_USER_PASSWORD: string,
    APP_REQ_RETRY_MAX_ATTEMPTS: number,
    APP_REQ_RETRY_STATUS_CODES: string,
    APP_REQ_RETRY_DELAY: number,
    APP_RETRY_CODES: string;
}
export const config: ConfigTypo = {

    APP_WMS_SERVICE_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_MDM_SERVICE_URL'] : process.env['APP_MDM_SERVICE_URL'] || 'http://192.168.0.18:3333',


    APP_WHATSAPP_NOTIFICATION_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_NOTIFICATION_URL'] : process.env[`APP_WHATSAPP_NOTIFICATION_URL`],
    APP_WHATSAPP_BROADCAST_URL: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_WHATSAPP_BROADCAST_URL'] : process.env[`APP_WHATSAPP_BROADCAST_URL`],
    APP_KEYCLOAK_REALM: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KEYCLOAK_REALM'] : process.env[`APP_KEYCLOAK_REALM`],
    APP_KC_CLIENT: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KC_CLIENT'] : process.env[`APP_KC_CLIENT`],
    APP_KC_SECRET: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KC_SECRET'] : process.env[`APP_KC_SECRET`],
    APP_KEYCLOAK_JOBS_USER_USER_NAME: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KEYCLOAK_JOBS_USER_USER_NAME'] : process.env[`APP_KEYCLOAK_JOBS_USER_USER_NAME`],
    APP_KEYCLOAK_JOBS_USER_PASSWORD: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_KEYCLOAK_JOBS_USER_PASSWORD'] : process.env[`APP_KEYCLOAK_JOBS_USER_PASSWORD`],
    APP_REQ_RETRY_MAX_ATTEMPTS: (typeof window !== 'undefined') ? window[`_env_`]?.['APP_REQ_RETRY_MAX_ATTEMPTS'] : process.env[`APP_REQ_RETRY_MAX_ATTEMPTS`] || 3,
    APP_REQ_RETRY_STATUS_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_REQ_RETRY_STATUS_CODES`] : process.env[`APP_REQ_RETRY_STATUS_CODES`] || '429,502',
    APP_REQ_RETRY_DELAY: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_REQ_RETRY_DELAY`] : process.env[`APP_REQ_RETRY_DELAY`] || 2000,
    APP_RETRY_CODES: (typeof window !== 'undefined') ? window[`_env_`]?.[`APP_RETRY_CODES`] : process.env[`APP_RETRY_CODES`] || 'ECONNABORTED',
}

export const whatsAppConfig = {
    PHONE_NUMBER_ID: '107287678965552',
    ACCESS_TOKEN: 'EAABtPfqQEJ0BAGLwjcos2nyZAaptYdOdPAoZBig7xgkZC82x10w72Fzw7xna1TAJ7YCG86ZAg9Vf083i2eSpSRBtlp4cZBZB1bvrZBEEhBNbe4GoMc6YHiHZAlivhzOkZAIv8c8bjHZAszqdZBIIGuGM9smQ6MZCZAtvbUUNKGqrlK6GWMSqFyfH3iLA0ZAPHlMfxTGYJJb41bPkbmwAZDZD',
    contacts: ['917036045967'],
    VERSION: 'v16.0',
}