import React from 'react';
import {
  createBrowserRouter,

} from "react-router";

import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import Home from './../pages/Home';
import MainLayout from '../layouts/MainLayout';
import ErrorPage from './../pages/ErrorPage';


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      }



    ],
    errorElement: <ErrorPage />

  },
  
  {
    path: "/login",
    element: <Login />

  }, {
    path: '/signUp',
    element: <SignUp />
  }
]);

export default router;