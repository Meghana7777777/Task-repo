import React, { useEffect } from 'react';
import './log-out-component.css';
import { useNavigate } from 'react-router-dom';
import { useIAMClientState } from '../iam-client';
import { logout } from '../actions';


export const LogOutComponent = () => {
    const { dispatch } = useIAMClientState();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
           await logout(dispatch);
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        handleLogout();
    }, [])
    

    return (
        <></>
    )
}

export default LogOutComponent;