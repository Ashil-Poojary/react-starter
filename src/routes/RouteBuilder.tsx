import React, { lazy } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import OpenLayout from '../layouts/OpenLayout';
import { LOGIN, REGISTRATION, DASHBOARD } from './routes';
import NotFound from '../pages/Auth/NotFound';
import { useUserContext } from '../context/UserContext';
import { Navigate } from 'react-router-dom';

const routeBuilder = (isLogedIn:boolean) => {


//private Page
    const DashBoard = lazy(() => import("../pages/Dashboard"));
 
  // open pages
    const Login = lazy(() => import("../pages/Auth/LoginPage"));
  const Register = lazy(() => import("../pages/Auth/RegistrationPage"));




  
  return [
    {
        element:<AuthLayout/>,
        children:[
            {
                path: LOGIN,
                element:<Login/>
            },
            {
                path: REGISTRATION,
                element:<Register/>
            }
        ],
    },

    {
        element:<OpenLayout/>,
        children:[
            {
                path: "*",
                element: isLogedIn ? <NotFound /> : <Navigate to={LOGIN} />,
              },
            
        ],

    }

  ]
}

export default routeBuilder