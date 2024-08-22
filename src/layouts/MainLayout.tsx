import React, { Suspense } from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { DASHBOARD, LOGIN } from '../routes/routes';

const MainLayout = () => {

    const { isLoggedIn } = useUserContext()

    

    if (isLoggedIn)
        return (
            < Suspense fallback={< div style={{flex:1,alignItems:"center"}}>Loding...</div>}>
                <Outlet />
            </Suspense >
        )

    return (
        <Navigate to={LOGIN} />
    )
 
}

export default MainLayout