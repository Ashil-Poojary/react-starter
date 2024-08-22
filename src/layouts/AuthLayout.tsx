import React, { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { DASHBOARD } from '../routes/routes'
import { useUserContext } from "../context/UserContext";


const AuthLayout = () => {

    const { isLoggedIn } = useUserContext()

    console.log(isLoggedIn);
    

    if (!isLoggedIn)
        return (
            < Suspense fallback={< div style={{flex:1,alignItems:"center"}}>Loding...</div>}>
                <Outlet />
            </Suspense >
        )

    return (
        <Navigate to={DASHBOARD} />
    )
}


export default AuthLayout

