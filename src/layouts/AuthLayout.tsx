import React, { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { DASHBOARD } from '../routes/routes'


const AuthLayout = () => {

    const { isLoggedIn } = useUserContext()

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
function useUserContext(): { isLoggedIn: any } {
    throw new Error('Function not implemented.')
}

