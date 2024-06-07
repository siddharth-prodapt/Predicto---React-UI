import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthGuard } from '../AuthGuard';

const PrivateRoutes = (props: any) => {
    const { Component } = props;
    const navigate = useNavigate();
    useEffect(() => {
        if (!AuthGuard()) {
            navigate('/login');
        }
    })
    return (
        <div>
            <Component />
        </div>
    )
}

export default PrivateRoutes
